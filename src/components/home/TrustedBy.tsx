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

      <div className="trustedby-logo-marquee">
        <div className="trustedby-logo-track">
          {[false, true].map((isDuplicate) => (
            <ul
              className="trustedby-logo-group"
              key={isDuplicate ? "duplicate" : "original"}
              aria-hidden={isDuplicate ? "true" : undefined}
            >
              {partners.map((partner) => (
                <li key={partner.name}>
                  <a
                    className="trustedby-logo-card"
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${partner.name} official website`}
                    tabIndex={isDuplicate ? -1 : undefined}
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
                      alt={isDuplicate ? "" : `${partner.name} logo`}
                      loading="lazy"
                    />
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
