import SectionHeader from "../ui/SectionHeader";
import { useTranslation } from "../../context/LanguageContext";

const partners = [
  { name: "Royaume du Maroc", logo: "/partners/royaume-du-maroc.png", url: "https://www.mcinet.gov.ma/" },
  { name: "FNTT Maroc", logo: "/partners/fntt-maroc.jpg", url: "https://fntt.org/" },
  { name: "STI", logo: "/partners/siti.png", url: "https://siti-tea.com/" },
  { name: "IMPEPACK", logo: "/partners/impepack.png", url: "https://www.impepack.com/" },
  { name: "ITRANE MARBRE", logo: "/partners/itrane-marbre.png", url: "https://www.itranemarbre.com/" },
  { name: "ARC Indus Maroc", logo: "/partners/arc-indus-maroc.png", url: "https://arcindus.com/" },
];

export default function TrustedBy() {
  const t = useTranslation();

  return (
    <section
      aria-label={t.trustedBy.ariaLabel}
      className="trustedby-section"
      style={{
        background: "var(--surface)",
        overflow: "hidden",
      }}
    >
      <div className="trustedby-heading">
        <SectionHeader
          badge={t.trustedBy.badge}
          title={t.trustedBy.title}
        />
      </div>

      <ul className="trustedby-logo-grid">
        {partners.map((partner) => (
          <li key={partner.name}>
            <a
              className="trustedby-logo-card"
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${partner.name} official website`}
            >
              <img
                className={`trustedby-logo-image${
                  partner.name === "IMPEPACK"
                    ? " trustedby-logo-image--inverted"
                    : partner.name === "STI"
                      ? " trustedby-logo-image--darken"
                      : ""
                }`}
                src={partner.logo}
                alt={`${partner.name} logo`}
                loading="lazy"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
