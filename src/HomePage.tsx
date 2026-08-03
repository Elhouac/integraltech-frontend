import Hero from "./components/home/Hero";
import TrustedBy from "./components/home/TrustedBy";
import Services from "./components/home/Services";
import HomeSolutions from "./components/home/HomeSolutions";
import WhyChooseUs from "./components/home/WhyChooseUs";
import StatsBar from "./components/home/StatsBar";
import About from "./components/home/About";
import Testimonials from "./components/home/Testimonials";
import CTA from "./components/home/CTA";
import Newsletter from "./components/home/Newsletter";
import { useTranslation, useLanguage } from "./context/LanguageContext";
import SEO from "./components/seo/SEO";

function HomePage() {
  const t = useTranslation();
  const { language } = useLanguage();

  return (
    <div id="home-page-container" style={{ fontFamily: "var(--font-sans)", minHeight: "100vh" }}>
      <SEO
        title={language === "en" ? "IT Solutions & Digital Transformation in Morocco" : "Solutions IT & Transformation Numérique au Maroc"}
        description={t.hero.subtitle}
        path="/"
      />
      <Hero />
      <Testimonials />
      <TrustedBy />
      <Services />
      <HomeSolutions />
      <WhyChooseUs />
      <StatsBar />
      <About />
      <section className="cta-newsletter-section">
        <div className="cta-newsletter-grid">
          <CTA />
          <Newsletter />
        </div>
      </section>
    </div>
  );
}
export default HomePage;
