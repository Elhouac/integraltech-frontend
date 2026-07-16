import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Search, Globe, Sun, Menu, X, Moon } from "lucide-react";
import useSearch from "../../context/SearchContext";
import { useLanguage, useTranslation } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import type { Language } from "../../i18n";
import { ORANGE, NAVY, DARK, BODY_TEXT, BORDER } from "../../constants";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { openSearch } = useSearch();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <motion.nav
      aria-label="Navigation principale"
      className="navbar-shell"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: isScrolled ? "var(--glass-bg)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
        border: isScrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
        boxShadow: isScrolled ? "var(--shadow-md)" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 20,
        width: "90%",
        maxWidth: 1400,
        margin: "20px auto 0",
        borderRadius: "18px",
        zIndex: 1000,
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
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }: { isActive: boolean }) => ({
              color: isActive ? ORANGE : DARK,
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
          >
            {({ isActive }) => (
              <>
                {link.label}
                {["/solutions", "/services"].includes(link.to) && (
                  <span style={{ marginLeft: 4, fontSize: 8 }}>▼</span>
                )}
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
        ))}
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
            color: BODY_TEXT,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = DARK;
            e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = BODY_TEXT;
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          aria-label={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
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
              color: BODY_TEXT,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = DARK;
              e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = BODY_TEXT;
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
                  right: 0,
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
                      textAlign: language === "ar" ? "right" : "left",
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
            color: BODY_TEXT,
            transition: "all 0.2s ease",
            marginRight: 4,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = DARK;
            e.currentTarget.style.backgroundColor = theme === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = BODY_TEXT;
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          aria-label="Open search"
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
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
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
            marginLeft: 4,
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
              left: 0,
              right: 0,
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
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobile}
                style={({ isActive }: { isActive: boolean }) => ({
                  color: isActive ? ORANGE : DARK,
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
                {link.label}
              </NavLink>
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
