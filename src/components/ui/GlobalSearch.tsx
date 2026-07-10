import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import useSearch from "../../context/SearchContext";
import { useTranslation } from "../../context/LanguageContext";

type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  to: string;
  category?: string;
};

export default function GlobalSearch() {
  const { open, close } = useSearch();
  const navigate = useNavigate();
  const t = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const gsapTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Define searchable index
  const getSearchIndex = (): SearchItem[] => [
    { id: "home", title: t.nav.home, category: "Pages", to: "/" },
    { id: "about", title: t.nav.about, category: "Pages", to: "/about" },
    { id: "solutions", title: t.nav.solutions, category: "Pages", to: "/solutions" },
    { id: "services", title: t.nav.services, category: "Pages", to: "/services" },
    { id: "blog", title: t.nav.blog, category: "Pages", to: "/blog" },
    { id: "contact", title: t.nav.contact, category: "Pages", to: "/contact" },
  ];

  const searchIndex = getSearchIndex();

  // Handle opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults(searchIndex);
      setActive(0);

      // Small delay to ensure DOM is ready
      setTimeout(() => inputRef.current?.focus(), 50);

      // Animate in
      if (gsapTimelineRef.current) gsapTimelineRef.current.kill();
      gsapTimelineRef.current = gsap.timeline();

      if (containerRef.current) {
        gsapTimelineRef.current.fromTo(
          containerRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3, ease: "power2.out" }
        );
      }

      if (contentRef.current) {
        gsapTimelineRef.current.fromTo(
          contentRef.current,
          { autoAlpha: 0, y: -16 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
          0.1
        );
      }
    }
  }, [open, searchIndex]);

  // Handle search query
  useEffect(() => {
    if (!query) return setResults(searchIndex);

    const q = query.trim().toLowerCase();
    const found = searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle?.toLowerCase().includes(q) ?? false) ||
        (item.category?.toLowerCase().includes(q) ?? false)
    );

    setResults(found);
    setActive(0);
  }, [query, searchIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((s) => Math.min(s + 1, results.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((s) => Math.max(s - 1, 0));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const item = results[active];
        if (item) {
          handleSelectItem(item);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, close]);

  // Handle clicking outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, close]);

  const handleSelectItem = (item: SearchItem) => {
    navigate(item.to);
    close();

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!open) return null;

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.search.placeholder}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "80px",
        paddingBottom: "200px",
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(4px)",
        overflowY: "auto",
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: "min(600px, 92%)",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 20px 60px rgba(12, 24, 40, 0.24)",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search Input */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <input
            ref={inputRef}
            type="text"
            aria-label={t.search.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.placeholder}
            style={{
              flex: 1,
              padding: "14px 16px",
              fontSize: "15px",
              fontFamily: "inherit",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(14, 110, 255, 0.3)";
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = "rgba(0, 0, 0, 0.08)";
            }}
          />
          <button
            onClick={close}
            aria-label={t.search.close}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              color: "#999",
              fontWeight: 500,
              padding: "8px 12px",
            }}
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div
          style={{
            maxHeight: "360px",
            overflowY: "auto",
            borderTop: "1px solid rgba(0, 0, 0, 0.06)",
            paddingTop: "8px",
          }}
        >
          {results.length === 0 ? (
            <div
              style={{
                padding: "20px 16px",
                color: "#999",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {t.search.noResults}
            </div>
          ) : (
            results.map((item, i) => (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                onMouseEnter={() => setActive(i)}
                style={{
                  width: "100%",
                  padding: "12px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  cursor: "pointer",
                  background: i === active ? "rgba(14, 110, 255, 0.08)" : "transparent",
                  border: "none",
                  borderRadius: "8px",
                  textAlign: "left",
                  transition: "background-color 0.15s",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "15px", color: "#000" }}>
                  {item.title}
                </div>
                {item.subtitle && (
                  <div style={{ fontSize: "13px", color: "#666" }}>{item.subtitle}</div>
                )}
                {item.category && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#999",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.category}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
