import { useLayoutEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { Search, Calendar, Tag, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";

gsap.registerPlugin(ScrollTrigger);

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const CATEGORIES = ["Tous", "Cybersécurité", "Cloud", "ERP", "Transformation digitale", "Actualités"];

const ARTICLES = [
  {
    id: 1, category: "Cybersécurité", date: "15 Juin 2026",
    title: "Les 10 meilleures pratiques pour sécuriser votre réseau d'entreprise",
    summary: "Découvrez les stratégies essentielles pour protéger votre infrastructure contre les cybermenaces modernes, des ransomwares aux attaques par phishing sophistiquées.",
    readTime: "5 min",
    color: "#E67E22",
  },
  {
    id: 2, category: "Cloud", date: "8 Juin 2026",
    title: "Migration vers Azure : retour d'expérience d'un client industriel marocain",
    summary: "Comment une entreprise manufacturière a réduit ses coûts IT de 35% en migrant vers Microsoft Azure avec l'accompagnement d'IntegralTech.",
    readTime: "7 min",
    color: "#29B6F6",
  },
  {
    id: 3, category: "ERP", date: "1 Juin 2026",
    title: "Microsoft Dynamics 365 vs SAP : quel ERP choisir pour une PME marocaine ?",
    summary: "Une comparaison détaillée des deux solutions ERP leaders du marché, avec les critères de choix adaptés au contexte économique marocain.",
    readTime: "8 min",
    color: "#CE93D8",
  },
  {
    id: 4, category: "Transformation digitale", date: "20 Mai 2026",
    title: "Intelligence Artificielle en entreprise : où en sont les PME africaines ?",
    summary: "Panorama de l'adoption de l'IA dans les entreprises africaines : opportunités, freins et feuille de route pour une transformation réussie.",
    readTime: "6 min",
    color: "#66BB6A",
  },
  {
    id: 5, category: "Actualités", date: "12 Mai 2026",
    title: "IntegralTech obtient la certification Microsoft Gold Partner pour la 4ème année consécutive",
    summary: "Cette distinction récompense notre expertise technique et notre engagement envers l'excellence dans la mise en œuvre des solutions Microsoft.",
    readTime: "3 min",
    color: "#FF7043",
  },
  {
    id: 6, category: "Cybersécurité", date: "5 Mai 2026",
    title: "RGPD et entreprises marocaines : comment se mettre en conformité en 2026 ?",
    summary: "Avec l'entrée en vigueur de la loi 09-08 au Maroc, la conformité des données devient cruciale. Voici une checklist pratique pour votre organisation.",
    readTime: "9 min",
    color: "#E67E22",
  },
  {
    id: 7, category: "Cloud", date: "28 Avril 2026",
    title: "Comment optimiser vos coûts cloud avec FinOps : guide complet",
    summary: "Le FinOps permet aux entreprises de réduire leurs dépenses cloud de 20 à 30% sans compromis sur les performances. Voici comment l'adopter.",
    readTime: "10 min",
    color: "#29B6F6",
  },
  {
    id: 8, category: "Transformation digitale", date: "15 Avril 2026",
    title: "RPA : automatisez vos tâches répétitives et libérez vos équipes",
    summary: "La robotisation des processus métiers (RPA) transforme la productivité des entreprises. Découvrez 5 cas d'usage concrets implementés pour nos clients.",
    readTime: "5 min",
    color: "#66BB6A",
  },
  {
    id: 9, category: "ERP", date: "5 Avril 2026",
    title: "Les erreurs à éviter lors d'un projet ERP : témoignages de DSI marocains",
    summary: "Des directeurs des systèmes d'information partagent les pièges classiques des projets ERP et comment les éviter avec une bonne méthodologie de conduite du changement.",
    readTime: "7 min",
    color: "#CE93D8",
  },
];

const ARTICLES_PER_PAGE = 6;

// ─── ARTICLE CARD ─────────────────────────────────────────────────────────────
function ArticleCard({ article, index }: { article: (typeof ARTICLES)[0]; index: number }) {
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
      const onEnter = () => gsap.to(el, { y: -5, boxShadow: "0 16px 40px rgba(0,0,0,0.12)", duration: 0.3, ease: "power2.out" });
      const onLeave = () => gsap.to(el, { y: 0, boxShadow: "0 4px 18px rgba(0,0,0,0.07)", duration: 0.3, ease: "power2.out" });
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    }, el);

    return () => ctx.revert();
  }, [index]);

  return (
    <article
      ref={ref}
      style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 18px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" }}
    >
      {/* Cover */}
      <div style={{ height: 180, background: `linear-gradient(135deg, ${DARK} 0%, ${article.color}55 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
        <div style={{ position: "absolute", top: 16, left: 16, background: article.color, color: "#fff", fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 1, padding: "4px 12px", borderRadius: 20, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}>
          <Tag size={10} />
          {article.category}
        </div>
        <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 15, color: "#fff", textAlign: "center", lineHeight: 1.4, maxWidth: 280, opacity: 0.85 }}>
          {article.title}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px 24px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "Open Sans, sans-serif", color: "#9aa5b4", fontSize: 12 }}>
            <Calendar size={12} />{article.date}
          </span>
          <span style={{ fontFamily: "Open Sans, sans-serif", color: "#9aa5b4", fontSize: 12 }}>
            {article.readTime} de lecture
          </span>
        </div>
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 17, color: DARK, lineHeight: 1.4, marginBottom: 12, flex: 1 }}>
          {article.title}
        </h3>
        <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 13, lineHeight: 1.75, marginBottom: 20 }}>
          {article.summary}
        </p>
        <Link
          to="/blog"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: ORANGE, fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 13, textDecoration: "none" }}
        >
          Lire l'article →
        </Link>
      </div>
    </article>
  );
}

// ─── NEWSLETTER SIDEBAR ────────────────────────────────────────────────────────
function Sidebar({ selected, onSelect }: { selected: string; onSelect: (c: string) => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(""); setTimeout(() => setSent(false), 4000); }
  };

  return (
    <aside style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Categories */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "24px 20px", boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 16 }}>Catégories</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              style={{
                background: selected === cat ? ORANGE : "transparent",
                color: selected === cat ? "#fff" : DARK,
                border: `1px solid ${selected === cat ? ORANGE : "rgba(0,0,0,0.1)"}`,
                borderRadius: 8,
                padding: "8px 14px",
                fontFamily: "Open Sans, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ background: NAVY, borderRadius: 14, padding: "28px 20px" }}>
        <Mail size={28} color={ORANGE} style={{ marginBottom: 14 }} />
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", marginBottom: 10 }}>Newsletter</h3>
        <p style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
          Recevez nos derniers articles et actualités IT directement dans votre boîte mail.
        </p>
        {sent ? (
          <p style={{ color: "#81C784", fontFamily: "Open Sans, sans-serif", fontSize: 13, fontWeight: 700 }}>✓ Inscription confirmée !</p>
        ) : (
          <form onSubmit={handleSub}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", fontFamily: "Open Sans, sans-serif", fontSize: 13, marginBottom: 10, boxSizing: "border-box" }}
            />
            <button
              type="submit"
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: ORANGE, color: "#fff", fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              S'abonner
            </button>
          </form>
        )}
      </div>

      {/* Recent */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "24px 20px", boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 16 }}>Articles récents</h3>
        {ARTICLES.slice(0, 4).map((a) => (
          <div key={a.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 12, marginBottom: 12 }}>
            <span style={{ display: "inline-block", background: `${a.color}22`, color: a.color, fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 10, padding: "2px 8px", borderRadius: 10, marginBottom: 6, textTransform: "uppercase" }}>
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
  usePageTransitionEffect();
  const [category, setCategory] = useState("Tous");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);

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
    return ARTICLES.filter((a) => {
      const matchCat = category === "Tous" || a.category === category;
      const matchSearch = !search.trim() || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE);

  const handleCatChange = (cat: string) => { setCategory(cat); setPage(1); };
  const handleSearch = (q: string) => { setSearch(q); setPage(1); };

  return (
    <div id="blog">
      {/* Hero */}
      <div ref={heroRef} style={{ background: DARK, color: "#fff", padding: "100px 80px 80px", textAlign: "center" }} className="blog-hero">
        <div data-hero style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontFamily: "Open Sans, sans-serif" }}>
          BLOG & ACTUALITÉS
        </div>
        <h1 data-hero style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 48, lineHeight: 1.15, maxWidth: 720, margin: "0 auto 20px" }}>
          Actualités Et Conseils IT
        </h1>
        <p data-hero style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.8, maxWidth: 600, margin: "0 auto 36px" }}>
          Découvrez nos articles, guides pratiques et retours d'expérience autour de la cybersécurité, le cloud et la transformation digitale.
        </p>
        {/* Search bar */}
        <div data-hero style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
          <Search size={18} color="rgba(255,255,255,0.5)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="search"
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: "100%", padding: "14px 16px 14px 46px", borderRadius: 10, border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", fontFamily: "Open Sans, sans-serif", fontSize: 15, outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* Category bar */}
      <div style={{ background: NAVY, padding: "18px 80px", display: "flex", gap: 10, overflowX: "auto" }} className="blog-catbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCatChange(cat)}
            style={{ background: category === cat ? ORANGE : "rgba(255,255,255,0.08)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontFamily: "Open Sans, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "background 0.2s" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ background: LIGHT_GRAY, padding: "60px 80px" }} className="blog-body">
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 40, alignItems: "flex-start" }} className="blog-layout">
          {/* Articles */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {paginated.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 20, color: DARK }}>Aucun article trouvé.</p>
                <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 14 }}>Essayez d'autres mots-clés ou catégories.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28 }} className="blog-grid">
                {paginated.map((a, i) => <ArticleCard key={a.id} article={a} index={i} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 48, alignItems: "center" }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: page === 1 ? "#e0e0e0" : ORANGE, color: page === 1 ? "#aaa" : "#fff", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: page === i + 1 ? ORANGE : "#fff", color: page === i + 1 ? "#fff" : DARK, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: page === totalPages ? "#e0e0e0" : ORANGE, color: page === totalPages ? "#aaa" : "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar selected={category} onSelect={handleCatChange} />
        </div>
      </div>
    </div>
  );
}
