import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import SEO from "../components/seo/SEO";
import { useLanguage } from "../context/LanguageContext";
import {
  integratedSolutionDetails,
  type LocalizedSolutionText,
} from "../data/integratedSolutionDetailsData";
import {
  integratedSolutions,
  type IntegratedSolution,
} from "../data/integratedSolutionsData";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";
import type { Language } from "../i18n";
import NotFoundPage from "./NotFoundPage";

interface DetailLabels {
  breadcrumbLabel: string;
  allSolutions: string;
  eyebrow: string;
  overviewTitle: string;
  capabilitiesTitle: string;
  capabilitiesDescription: string;
  benefitsPrefix: string;
  benefitsDescription: string;
  contact: string;
  browseSolutions: string;
  previous: string;
  next: string;
  logoFallback: string;
  seoSuffix: string;
}

const labels: Record<Language, DetailLabels> = {
  fr: {
    breadcrumbLabel: "Fil d’Ariane",
    allSolutions: "Toutes les solutions",
    eyebrow: "Solution ERP intégrée",
    overviewTitle: "Une gestion conçue pour votre métier",
    capabilitiesTitle: "Des capacités connectées",
    capabilitiesDescription:
      "Des modules métier réunis dans un environnement cohérent pour mieux piloter chaque opération.",
    benefitsPrefix: "Pourquoi choisir",
    benefitsDescription:
      "Une base de gestion claire pour centraliser l’information, fluidifier les équipes et garder le contrôle.",
    contact: "Contacter un expert",
    browseSolutions: "Voir toutes les solutions",
    previous: "Solution précédente",
    next: "Solution suivante",
    logoFallback: "Logo indisponible",
    seoSuffix: "Solution ERP intégrée",
  },
  en: {
    breadcrumbLabel: "Breadcrumb",
    allSolutions: "All solutions",
    eyebrow: "Integrated ERP solution",
    overviewTitle: "Management built around your business",
    capabilitiesTitle: "Connected capabilities",
    capabilitiesDescription:
      "Business modules brought together in one coherent environment to manage every operation more effectively.",
    benefitsPrefix: "Why choose",
    benefitsDescription:
      "A clear management foundation that centralizes information, streamlines teamwork and keeps operations under control.",
    contact: "Contact an expert",
    browseSolutions: "Browse all solutions",
    previous: "Previous solution",
    next: "Next solution",
    logoFallback: "Logo unavailable",
    seoSuffix: "Integrated ERP solution",
  },
  ar: {
    breadcrumbLabel: "مسار التنقل",
    allSolutions: "جميع الحلول",
    eyebrow: "حل ERP متكامل",
    overviewTitle: "إدارة مصممة حول نشاطك",
    capabilitiesTitle: "إمكانات مترابطة",
    capabilitiesDescription:
      "وحدات متخصصة مجمعة في بيئة متناسقة لتحسين إدارة كل عملية.",
    benefitsPrefix: "لماذا تختار",
    benefitsDescription:
      "قاعدة إدارة واضحة لتوحيد المعلومات وتسهيل تعاون الفرق والحفاظ على التحكم.",
    contact: "تواصل مع خبير",
    browseSolutions: "استعرض جميع الحلول",
    previous: "الحل السابق",
    next: "الحل التالي",
    logoFallback: "الشعار غير متاح",
    seoSuffix: "حل ERP متكامل",
  },
};

function localize(value: LocalizedSolutionText, language: Language) {
  return value[language];
}

function SolutionDetailLogo({
  solution,
  fallbackLabel,
}: {
  solution: IntegratedSolution;
  fallbackLabel: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const FallbackIcon = solution.icon;

  if (imageFailed) {
    return (
      <div className="solution-detail-logo-fallback" role="img" aria-label={`${solution.officialName}, ${fallbackLabel}`}>
        <FallbackIcon size={56} strokeWidth={1.5} aria-hidden="true" />
        <span>{solution.officialName}</span>
      </div>
    );
  }

  return (
    <img
      className="solution-detail-logo"
      src={solution.logo}
      alt={`${solution.officialName} logo`}
      onError={() => setImageFailed(true)}
    />
  );
}

export default function SolutionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const copy = labels[language];
  const solution = integratedSolutions.find((item) => item.slug === slug);

  usePageTransitionEffect();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  if (!solution) {
    return <NotFoundPage />;
  }

  const detail = integratedSolutionDetails[solution.slug];
  const currentIndex = integratedSolutions.findIndex((item) => item.slug === solution.slug);
  const previousSolution = integratedSolutions[(currentIndex - 1 + integratedSolutions.length) % integratedSolutions.length];
  const nextSolution = integratedSolutions[(currentIndex + 1) % integratedSolutions.length];
  const summary = localize(detail.heroSummary, language);

  return (
    <div className="solution-detail-page">
      <SEO
        title={`${solution.officialName} | ${copy.seoSuffix}`}
        description={summary}
        path={solution.route}
        ogImage={solution.logo}
      />

      <section className="solution-detail-hero" aria-labelledby="solution-detail-title">
        <div className="solution-detail-container">
          <nav className="solution-detail-breadcrumb" aria-label={copy.breadcrumbLabel}>
            <Link to="/solutions">{copy.allSolutions}</Link>
            <ChevronRight className="solution-detail-directional-icon" size={15} aria-hidden="true" />
            <span aria-current="page">{solution.officialName}</span>
          </nav>

          <div className="solution-detail-hero-grid">
            <div className="solution-detail-hero-copy">
              <span className="solution-detail-eyebrow">{copy.eyebrow}</span>
              <h1 id="solution-detail-title">{solution.officialName}</h1>
              <p>{summary}</p>

              <div className="solution-detail-actions">
                <Link className="solution-detail-primary-action" to="/contact">
                  <MessageCircle size={18} aria-hidden="true" />
                  {copy.contact}
                </Link>
                <Link className="solution-detail-secondary-action" to="/solutions">
                  {copy.browseSolutions}
                  <ArrowRight className="solution-detail-directional-icon" size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="solution-detail-visual" aria-label={solution.officialName}>
              <div className="solution-detail-visual-accent" aria-hidden="true" />
              <SolutionDetailLogo
                key={solution.slug}
                solution={solution}
                fallbackLabel={copy.logoFallback}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="solution-detail-overview" aria-labelledby="solution-overview-title">
        <div className="solution-detail-container solution-detail-overview-inner">
          <span className="solution-detail-section-index" aria-hidden="true">01</span>
          <div>
            <h2 id="solution-overview-title">{copy.overviewTitle}</h2>
            <p>{summary}</p>
          </div>
        </div>
      </section>

      <section className="solution-detail-capabilities" aria-labelledby="solution-capabilities-title">
        <div className="solution-detail-container">
          <div className="solution-detail-section-heading">
            <span className="solution-detail-section-index" aria-hidden="true">02</span>
            <div>
              <h2 id="solution-capabilities-title">{copy.capabilitiesTitle}</h2>
              <p>{copy.capabilitiesDescription}</p>
            </div>
          </div>

          <div className="solution-detail-capabilities-grid">
            {detail.capabilities.map((capability, index) => (
              <article className="solution-detail-capability" key={localize(capability.title, language)}>
                <span className="solution-detail-capability-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{localize(capability.title, language)}</h3>
                  <p>{localize(capability.description, language)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="solution-detail-benefits" aria-labelledby="solution-benefits-title">
        <div className="solution-detail-container">
          <div className="solution-detail-benefits-panel">
            <div className="solution-detail-benefits-copy">
              <span className="solution-detail-section-index" aria-hidden="true">03</span>
              <h2 id="solution-benefits-title">{copy.benefitsPrefix} {solution.officialName}</h2>
              <p>{copy.benefitsDescription}</p>
            </div>

            <ul className="solution-detail-benefits-list">
              {detail.benefits.map((benefit) => (
                <li key={localize(benefit, language)}>
                  <CheckCircle2 size={20} aria-hidden="true" />
                  <span>{localize(benefit, language)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <nav className="solution-detail-pagination" aria-label={copy.browseSolutions}>
        <div className="solution-detail-container solution-detail-pagination-inner">
          <Link to={previousSolution.route} aria-label={`${copy.previous}: ${previousSolution.officialName}`}>
            <ArrowLeft className="solution-detail-directional-icon" size={20} aria-hidden="true" />
            <span>
              <small>{copy.previous}</small>
              <strong>{previousSolution.officialName}</strong>
            </span>
          </Link>
          <Link
            className="solution-detail-pagination-next"
            to={nextSolution.route}
            aria-label={`${copy.next}: ${nextSolution.officialName}`}
          >
            <span>
              <small>{copy.next}</small>
              <strong>{nextSolution.officialName}</strong>
            </span>
            <ArrowRight className="solution-detail-directional-icon" size={20} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
