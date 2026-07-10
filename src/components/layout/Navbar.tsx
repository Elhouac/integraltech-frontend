import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Search, Globe } from "lucide-react";
import useSearch from "../../context/SearchContext";
import { useLanguage, useTranslation } from "../../context/LanguageContext";
import type { Language } from "../../i18n";

const ORANGE = "#E67E22";
const NAVY = "#34568B";
const DARK = "#2C3E50";

export default function Navbar() {
  const { openSearch } = useSearch();
  const { language, setLanguage } = useLanguage();
  const t = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/solutions", label: t.nav.solutions },
    { to: "/services", label: t.nav.services },
    { to: "/blog", label: t.nav.blog },
    { to: "/contact", label: t.nav.contact },
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
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      style={{
        background: "#fff",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 72,
        position: "relative",
        zIndex: 10,
      }}
    >
      <div className="navbar-logo" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo.png"
          alt="Integral Progress Technology"
          style={{ height: 52, objectFit: "contain" }}
        />
      </div>

      <div className="navbar-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {links.map((link) => (
          <motion.div key={link.to} whileHover={{ color: ORANGE, y: -1 }} transition={{ duration: 0.15 }}>
              <NavLink
              to={link.to}
              style={({ isActive }: { isActive: boolean }) => ({
                color: isActive ? ORANGE : DARK,
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                textDecoration: "none",
                fontFamily: "Open Sans, sans-serif",
              })}
            >
              {link.label}
              {['/solutions', '/services'].includes(link.to) && (
                <span style={{ marginLeft: 4, fontSize: 10 }}>▼</span>
              )}
            </NavLink>
          </motion.div>
        ))}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar-mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: 72,
              left: 0,
              right: 0,
              background: "#fff",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              padding: "16px 24px",
              display: "flex",
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
                  fontFamily: "Open Sans, sans-serif",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="navbar-actions" style={{ display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
        {/* Language Selector */}
        <motion.div
          style={{ position: "relative" }}
          onMouseEnter={() => setShowLanguageMenu(true)}
          onMouseLeave={() => setShowLanguageMenu(false)}
        >
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              color: DARK,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
            onMouseLeave={(e) => (e.currentTarget.style.color = DARK)}
            aria-label={t.nav.language}
            aria-expanded={showLanguageMenu}
          >
            <Globe size={18} />
          </button>

          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 8,
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  overflow: "hidden",
                  minWidth: 140,
                  zIndex: 1000,
                }}
              >
                {(["fr", "en"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "none",
                      background: language === lang ? "rgba(230, 126, 34, 0.1)" : "transparent",
                      color: language === lang ? ORANGE : DARK,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: language === lang ? 600 : 500,
                      textAlign: "left",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (language !== lang) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "rgba(0, 0, 0, 0.04)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (language !== lang) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "transparent";
                      }
                    }}
                  >
                    {lang === "fr" ? "🇫🇷 " : "🇬🇧 "}
                    {lang === "fr" ? t.nav.french : t.nav.english}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search Button */}
        <button
          onClick={() => openSearch()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            color: DARK,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
          onMouseLeave={(e) => (e.currentTarget.style.color = DARK)}
          aria-label="Open search"
        >
          <Search size={18} />
        </button>

        <button
          className="navbar-icon-button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
          style={{
            background: NAVY,
            border: "none",
            borderRadius: 6,
            width: 36,
            height: 36,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 14,
                height: 2,
                background: "#fff",
                display: "block",
              }}
            />
          ))}
        </button>
      </div>
    </motion.nav>
  );
}