const DARK = "#2C3E50";
export default function Footer() {
  return (
    <footer className="footer-section" style={{ background: DARK, color: "#fff", padding: "60px 80px 32px" }}>
      <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
        <div>
          <img src="/logo.png" alt="IntegralTech" loading="lazy" decoding="async" style={{ height: 44, objectFit: "contain", marginBottom: 16 }} />
          <p style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.8 }}>
            Votre partenaire technologique de confiance au Maroc depuis plus de 10 ans.
          </p>
        </div>
        {[
          { title: "Solutions", links: ["ERP", "Cybersécurité", "Cloud", "BI"] },
          { title: "Services", links: ["Support", "Audit", "Formation", "Conseil"] },
          { title: "Entreprise", links: ["À Propos", "Blog", "Contact", "Carrières"] },
        ].map((col) => (
          <div key={col.title}>
            <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{col.title}</div>
            {col.links.map((link) => (
              <div key={link} style={{ marginBottom: 8 }}>
                <a href="#" style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none" }}>{link}</a>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 24, textAlign: "center", fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
        © 2024 Integral Progress Technology. Tous droits réservés.
      </div>
    </footer>
  );
}
