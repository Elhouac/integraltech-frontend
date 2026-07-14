import { NavLink } from "react-router-dom";
import { ORANGE, NAVY, DARK, BODY_TEXT, BORDER } from "../../constants";
import { useTranslation } from "../../context/LanguageContext";

export default function Footer() {
  const t = useTranslation();

  const columns = [
    {
      title: "Solutions",
      links: [
        { label: "ERP", to: "/solutions" },
        { label: "Cybersécurité", to: "/solutions" },
        { label: "Cloud", to: "/solutions" },
        { label: "BI", to: "/solutions" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Support", to: "/services" },
        { label: "Audit", to: "/services" },
        { label: "Formation", to: "/services" },
        { label: "Conseil", to: "/services" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { label: "À Propos", to: "/about" },
        { label: "Blog", to: "/blog" },
        { label: "Contact", to: "/contact" },
        { label: "Carrières", to: "/about" },
      ],
    },
  ];

  return (
    <footer
      className="footer-section"
      style={{
        background: `linear-gradient(180deg, #0A1628 0%, #0F1D32 100%)`,
        color: "#fff",
        padding: "80px 0 32px",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: 1400,
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
          {/* Brand */}
          <div>
            <img
              src="/logo.png"
              alt="IntegralTech"
              loading="lazy"
              decoding="async"
              style={{
                height: 44,
                objectFit: "contain",
                marginBottom: 20,
              }}
            />
            <p
              style={{
                fontFamily: "Open Sans, sans-serif",
                color: "rgba(255,255,255,0.55)",
                fontSize: 14,
                lineHeight: 1.8,
                maxWidth: 280,
                margin: 0,
              }}
            >
              Votre partenaire technologique de confiance au Maroc depuis plus de 10 ans.
            </p>

            {/* Social Icons */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 24,
              }}
            >
              {["LinkedIn", "Twitter", "GitHub"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 12,
                    fontFamily: "Outfit, sans-serif",
                    textDecoration: "none",
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = ORANGE;
                    e.currentTarget.style.color = ORANGE;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "Outfit, sans-serif",
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
                <div key={link.label} style={{ marginBottom: 10 }}>
                  <NavLink
                    to={link.to}
                    style={{
                      fontFamily: "Open Sans, sans-serif",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 14,
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = ORANGE;
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

        {/* Bottom Bar */}
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
              fontFamily: "Open Sans, sans-serif",
              color: "rgba(255,255,255,0.35)",
              fontSize: 13,
            }}
          >
            © {new Date().getFullYear()} Integral Progress Technology. Tous droits réservés.
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
            }}
          >
            {["Confidentialité", "CGU", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: "Open Sans, sans-serif",
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
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
