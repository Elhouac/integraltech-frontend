import { useLayoutEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import { Search, Calendar, Tag, ChevronLeft, ChevronRight, Mail, ArrowRight } from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE, BODY_TEXT, BORDER, CARD_BG } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";
import { useTranslation } from "../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

interface ArticleItem {
  id: number;
  categoryKey: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  readTime: string;
  color: string;
}

interface CategoryItem {
  label: string;
  key: string;
}

const ARTICLES_PER_PAGE = 6;

// ─── ARTICLE CARD ─────────────────────────────────────────────────────────────
function ArticleCard({ article, index }: { article: ArticleItem; index: number }) {
  const t = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 0.65, ease: "power3.out",
        delay: (index % 3) * 0.1,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      const onEnter = () => gsap.to(el, { y: -5, boxShadow: "0 16px 40px rgba(15,23,42,0.1)", duration: 0.3, ease: "power2.out" });
      const onLeave = () => gsap.to(el, { y: 0, boxShadow: "0 2px 16px rgba(15,23,42,0.05)", duration: 0.3, ease: "power2.out" });
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    }, el);

    return () => ctx.revert();
  }, [index]);

  return (
    <article
      ref={ref}
      style={{
        background: CARD_BG, borderRadius: 18, overflow: "hidden",
        boxShadow: "0 2px 16px rgba(15,23,42,0.05)", display: "flex",
        flexDirection: "column", border: `1px solid ${BORDER}`,
      }}
    >
      {/* Cover */}
      <div style={{
        height: 180, background: `linear-gradient(135deg, ${NAVY} 0%, ${article.color}44 100%)`,
        display: "flex", alignItems: "center", justifyItems: "center",
        justifyContent: "center", padding: 24, position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 16, left: 16,
          background: article.color, color: "#fff",
          fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 10,
          letterSpacing: 1, padding: "4px 12px", borderRadius: 20,
          textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5,
        }}>
          <Tag size={10} />
          {article.category}
        </div>
        <div style={{
          fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 15,
          color: "#fff", textAlign: "center", lineHeight: 1.4,
          maxWidth: 280, opacity: 0.85,
        }}>
          {article.title}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px 24px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 12, opacity: 0.7 }}>
            <Calendar size={12} />{article.date}
          </span>
          <span style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 12, opacity: 0.7 }}>
            {article.readTime} {t.blogPage.readTime}
          </span>
        </div>
        <h3 style={{
          fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 17,
          color: DARK, lineHeight: 1.4, marginBottom: 12, flex: 1, margin: "0 0 12px",
        }}>
          {article.title}
        </h3>
        <p style={{
          fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 13,
          lineHeight: 1.75, margin: "0 0 20px",
        }}>
          {article.summary}
        </p>
        <Link
          to="/blog"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: ORANGE, fontFamily: "Outfit, sans-serif", fontWeight: 600,
            fontSize: 13, textDecoration: "none", transition: "gap 0.2s",
          }}
        >
          {t.blogPage.readArticle}
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

// ─── NEWSLETTER SIDEBAR ────────────────────────────────────────────────────────
interface SidebarProps {
  selected: string;
  onSelect: (c: string) => void;
  categoriesList: CategoryItem[];
  recentArticles: ArticleItem[];
}

function Sidebar({ selected, onSelect, categoriesList, recentArticles }: SidebarProps) {
  const t = useTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(""); setTimeout(() => setSent(false), 4000); }
  };

  return (
    <aside style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Categories */}
      <div style={{
        background: CARD_BG, borderRadius: 16, padding: "24px 20px",
        border: `1px solid ${BORDER}`,
      }}>
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 16, margin: "0 0 16px" }}>{t.blogPage.sidebar.categories}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {categoriesList.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onSelect(cat.key)}
              style={{
                background: selected === cat.key ? ORANGE : "transparent",
                color: selected === cat.key ? "#fff" : DARK,
                border: `1px solid ${selected === cat.key ? ORANGE : BORDER}`,
                borderRadius: 10,
                padding: "9px 14px",
                fontFamily: "Open Sans, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 100%)`,
        borderRadius: 16, padding: "28px 20px",
      }}>
        <Mail size={24} color={ORANGE} style={{ marginBottom: 14 }} />
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 10, margin: "0 0 10px" }}>{t.blogPage.sidebar.newsletter}</h3>
        <p style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
          {t.blogPage.sidebar.newsletterDesc}
        </p>
        {sent ? (
          <p style={{ color: "#22C55E", fontFamily: "Open Sans, sans-serif", fontSize: 13, fontWeight: 700, margin: 0 }}>{t.blogPage.sidebar.subscribed}</p>
        ) : (
          <form onSubmit={handleSub}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.blogPage.sidebar.emailPlaceholder}
              required
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
                color: "#fff", fontFamily: "Open Sans, sans-serif", fontSize: 13,
                marginBottom: 10, boxSizing: "border-box", outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%", padding: "10px", borderRadius: 10, border: "none",
                background: ORANGE, color: "#fff", fontFamily: "Outfit, sans-serif",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(249,115,22,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              {t.blogPage.sidebar.subscribe}
            </button>
          </form>
        )}
      </div>

      {/* Recent */}
      <div style={{
        background: CARD_BG, borderRadius: 16, padding: "24px 20px",
        border: `1px solid ${BORDER}`,
      }}>
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 16, margin: "0 0 16px" }}>{t.blogPage.sidebar.recentArticles}</h3>
        {recentArticles.map((a) => (
          <div key={a.id} style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 12, marginBottom: 12 }}>
            <span style={{
              display: "inline-block", background: `${a.color}15`, color: a.color,
              fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 10,
              padding: "2px 8px", borderRadius: 10, marginBottom: 6, textTransform: "uppercase",
            }}>
              {a.category}
            </span>
            <p style={{ fontFamily: "Open Sans, sans-serif", fontSize: 13, color: DARK, fontWeight: 600, lineHeight: 1.4, margin: 0 }}>{a.title}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const t = useTranslation();
  usePageTransitionEffect();
  const [category, setCategory] = useState("Tous");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);

  const categoriesList: CategoryItem[] = [
    { label: t.blogPage.categories.all, key: "Tous" },
    { label: t.blogPage.categories.cybersecurity, key: "Cybersécurité" },
    { label: t.blogPage.categories.cloud, key: "Cloud" },
    { label: t.blogPage.categories.erp, key: "ERP" },
    { label: t.blogPage.categories.digitalTransform, key: "Transformation digitale" },
    { label: t.blogPage.categories.news, key: "Actualités" }
  ];

  const articlesList: ArticleItem[] = [
    { id: 1, categoryKey: "Cybersécurité", category: t.blogPage.categories.cybersecurity, date: t.blogPage.art1Date, title: t.blogPage.art1Title, summary: t.blogPage.art1Summary, readTime: `5 ${t.blogPage.readTimeShort}`, color: ORANGE },
    { id: 2, categoryKey: "Cloud", category: t.blogPage.categories.cloud, date: t.blogPage.art2Date, title: t.blogPage.art2Title, summary: t.blogPage.art2Summary, readTime: `7 ${t.blogPage.readTimeShort}`, color: "#29B6F6" },
    { id: 3, categoryKey: "ERP", category: t.blogPage.categories.erp, date: t.blogPage.art3Date, title: t.blogPage.art3Title, summary: t.blogPage.art3Summary, readTime: `8 ${t.blogPage.readTimeShort}`, color: "#CE93D8" },
    { id: 4, categoryKey: "Transformation digitale", category: t.blogPage.categories.digitalTransform, date: t.blogPage.art4Date, title: t.blogPage.art4Title, summary: t.blogPage.art4Summary, readTime: `6 ${t.blogPage.readTimeShort}`, color: "#66BB6A" },
    { id: 5, categoryKey: "Actualités", category: t.blogPage.categories.news, date: t.blogPage.art5Date, title: t.blogPage.art5Title, summary: t.blogPage.art5Summary, readTime: `3 ${t.blogPage.readTimeShort}`, color: "#FF7043" },
    { id: 6, categoryKey: "Cybersécurité", category: t.blogPage.categories.cybersecurity, date: t.blogPage.art6Date, title: t.blogPage.art6Title, summary: t.blogPage.art6Summary, readTime: `9 ${t.blogPage.readTimeShort}`, color: ORANGE },
    { id: 7, categoryKey: "Cloud", category: t.blogPage.categories.cloud, date: t.blogPage.art7Date, title: t.blogPage.art7Title, summary: t.blogPage.art7Summary, readTime: `10 ${t.blogPage.readTimeShort}`, color: "#29B6F6" },
    { id: 8, categoryKey: "Transformation digitale", category: t.blogPage.categories.digitalTransform, date: t.blogPage.art8Date, title: t.blogPage.art8Title, summary: t.blogPage.art8Summary, readTime: `5 ${t.blogPage.readTimeShort}`, color: "#66BB6A" },
    { id: 9, categoryKey: "ERP", category: t.blogPage.categories.erp, date: t.blogPage.art9Date, title: t.blogPage.art9Title, summary: t.blogPage.art9Summary, readTime: `7 ${t.blogPage.readTimeShort}`, color: "#CE93D8" },
  ];

  useLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll<HTMLElement>("[data-hero]"), {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out", stagger: 0.15,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const filtered = useMemo(() => {
    return articlesList.filter((a) => {
      const matchCat = category === "Tous" || a.categoryKey === category;
      const matchSearch = !search.trim() || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search, articlesList]);

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE);

  const handleCatChange = (cat: string) => { setCategory(cat); setPage(1); };
  const handleSearch = (q: string) => { setSearch(q); setPage(1); };

  const recentArticles = useMemo(() => articlesList.slice(0, 4), [articlesList]);

  return (
    <div id="blog">
      <SEO
        title={t.blogPage.seoTitle}
        description={t.blogPage.seoDesc}
        path="/blog"
      />
      {/* Hero */}
      <div ref={heroRef} style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 50%, #1a2a5e 100%)`,
        color: "#fff", padding: "120px 0 96px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }} className="blog-hero">
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)",
          width: 700, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{ width: "90%", maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div data-hero style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)",
            padding: "6px 16px", borderRadius: "99px",
            color: ORANGE, fontWeight: 600, fontSize: 12, fontFamily: "Outfit, sans-serif",
            textTransform: "uppercase", letterSpacing: "1px", marginBottom: 24,
          }}>
            {t.blogPage.badge}
          </div>
          <h1 data-hero style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.15,
            maxWidth: 720, margin: "0 auto 20px", letterSpacing: "-0.5px",
          }}>
            {t.blogPage.title}
          </h1>
          <p data-hero style={{
            fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)",
            fontSize: 17, lineHeight: 1.8, maxWidth: 600, margin: "0 auto 40px",
          }}>
            {t.blogPage.desc}
          </p>
          {/* Search bar */}
          <div data-hero style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
            <Search size={18} color="rgba(255,255,255,0.4)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="search"
              placeholder={t.blogPage.searchPlaceholder}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: "100%", padding: "14px 16px 14px 46px", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)",
                color: "#fff", fontFamily: "Open Sans, sans-serif", fontSize: 15,
                outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = ORANGE; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            />
          </div>
        </div>
      </div>

      {/* Category bar */}
      <div style={{
        background: `linear-gradient(135deg, #0f1b3d 0%, ${NAVY} 100%)`,
        padding: "18px 0", display: "flex", justifyContent: "center",
        gap: 8, overflowX: "auto",
      }} className="blog-catbar">
        <div style={{ width: "90%", maxWidth: 1200, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {categoriesList.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCatChange(cat.key)}
              style={{
                background: category === cat.key ? ORANGE : "rgba(255,255,255,0.06)",
                color: "#fff", border: `1px solid ${category === cat.key ? ORANGE : "rgba(255,255,255,0.1)"}`,
                borderRadius: 10, padding: "8px 18px",
                fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 13,
                cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ background: LIGHT_GRAY, padding: "72px 0" }} className="blog-body">
        <div style={{
          width: "90%", maxWidth: 1200, margin: "0 auto",
          display: "flex", gap: 36, alignItems: "flex-start",
        }} className="blog-layout">
          {/* Articles */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {paginated.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 20, color: DARK, margin: "0 0 8px" }}>{t.blogPage.noArticles}</p>
                <p style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 14, margin: 0 }}>{t.blogPage.tryOtherKeywords}</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }} className="blog-grid">
                {paginated.map((a, i) => <ArticleCard key={a.id} article={a} index={i} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 48, alignItems: "center" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    width: 40, height: 40, borderRadius: 12, border: `1px solid ${BORDER}`,
                    background: page === 1 ? LIGHT_GRAY : CARD_BG,
                    color: page === 1 ? BORDER : DARK,
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{
                      width: 40, height: 40, borderRadius: 12,
                      border: page === i + 1 ? "none" : `1px solid ${BORDER}`,
                      background: page === i + 1 ? ORANGE : CARD_BG,
                      color: page === i + 1 ? "#fff" : DARK,
                      fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14,
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    width: 40, height: 40, borderRadius: 12, border: `1px solid ${BORDER}`,
                    background: page === totalPages ? LIGHT_GRAY : CARD_BG,
                    color: page === totalPages ? BORDER : DARK,
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar
            selected={category}
            onSelect={handleCatChange}
            categoriesList={categoriesList}
            recentArticles={recentArticles}
          />
        </div>
      </div>
    </div>
  );
}
