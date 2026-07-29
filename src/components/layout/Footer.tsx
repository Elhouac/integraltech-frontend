import { NavLink } from "react-router-dom";
import { Facebook, Linkedin, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";

// columns and socials (moved or typed below)

const socials = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/IntegralProgressTech/" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/integral-progress-technology/" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/integralprogresstechnology/" },
  { icon: Twitter, label: "X (Twitter)", href: "https://twitter.com/" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/" },
];

export default function Footer() {
  const t = useTranslation();

  const columns = [
    {
      title: t.footer.solutions,
      links: [
        { label: t.megaMenu.enterprise, to: "/solutions" },
        { label: t.megaMenu.cloud, to: "/solutions" },
        { label: t.megaMenu.security, to: "/solutions" },
        { label: t.megaMenu.ecommerce, to: "/solutions" },
      ],
    },
    {
      title: t.footer.services,
      links: [
        { label: t.megaMenu.cybersecurity, to: "/services#cybersecurite" },
        { label: t.megaMenu.cloudInfra, to: "/services#cloud" },
        { label: t.megaMenu.erp, to: "/services#erp" },
        { label: t.megaMenu.techSupport, to: "/services#support" },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { label: t.nav.about, to: "/about" },
        { label: t.nav.blog, to: "/blog" },
        { label: t.nav.contact, to: "/contact" },
        { label: t.footer.careers, to: "/about" },
      ],
    },
  ];

  return (
    <footer
      className="footer-section"
      style={{
        background: "linear-gradient(180deg, #0A1628 0%, #0F1D32 100%)",
        color: "#fff",
        padding: "80px 0 32px",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        {/* Grid */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 56,
          }}
        >
          {/* Brand column */}
          <div>
            <img
              src="/logo.png"
              alt="IntegralTech"
              loading="lazy"
              decoding="async"
              style={{ height: 44, objectFit: "contain", marginBottom: 20 }}
            />
            <p
              style={{
                fontFamily: "var(--font-sans)",
                color: "rgba(255,255,255,0.55)",
                fontSize: 14,
                lineHeight: 1.8,
                maxWidth: 280,
                margin: "0 0 20px",
              }}
            >
              {t.footer.desc}
            </p>

            {/* Contact info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              <a
                href="tel:+212688164547"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  color: "rgba(255,255,255,0.5)", fontSize: 13,
                  fontFamily: "var(--font-sans)", textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              >
                <Phone size={14} />
                +212 (0) 688 164 547
              </a>
              <a
                href="mailto:contact@integraltech.ma"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  color: "rgba(255,255,255,0.5)", fontSize: 13,
                  fontFamily: "var(--font-sans)", textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              >
                <Mail size={14} />
                contact@integraltech.ma
              </a>
              <div
                style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  color: "rgba(255,255,255,0.5)", fontSize: 13,
                  fontFamily: "var(--font-sans)",
                }}
              >
                <MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                Av Allal Elfassi, Centre Itrane, 3ème Étage N° 33 - Marrakech
              </div>
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 10 }}>
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                      e.currentTarget.style.background = "rgba(249, 115, 22, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 14,
                  marginBottom: 20,
                  color: "#fff",
                  letterSpacing: "0.3px",
                }}
              >
                {col.title}
              </div>
              {col.links.map((link) => (
                <div key={link.label} style={{ marginBottom: 12 }}>
                  <NavLink
                    to={link.to}
                    style={{
                      fontFamily: "var(--font-sans)",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 14,
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    }}
                  >
                    {link.label}
                  </NavLink>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-sans)",
              color: "rgba(255,255,255,0.35)",
              fontSize: 13,
            }}
          >
            © {new Date().getFullYear()} Integral Progress Technology. {t.footer.allRights}.
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: t.footer.privacy, key: "privacy" },
              { label: t.footer.terms, key: "terms" },
              { label: t.footer.cookies, key: "cookies" }
            ].map((item) => (
              <a
                key={item.key}
                href="#"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
