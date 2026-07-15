import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import StatsBar from "./components/home/StatsBar";
import Services from "./components/home/Services";
import About from "./components/home/About";
import Testimonials from "./components/home/Testimonials";
import TrustedBy from "./components/home/TrustedBy";
import CTA from "./components/home/CTA";
import Newsletter from "./components/home/Newsletter";
import Footer from "./components/layout/Footer";
import { useTranslation } from "./context/LanguageContext";
import SEO from "./components/seo/SEO";

function HomePage() {
  const t = useTranslation();

  return (
    <div style={{ fontFamily: "Open Sans, sans-serif", minHeight: "100vh" }}>
      <SEO
        title="Solutions IT & Transformation Numérique au Maroc"
        description="IntegralTech accompagne les entreprises marocaines avec des solutions IT innovantes, cybersécurité, cloud, ERP, BI et conseil."
        path="/"
      />
      <a className="skip-link" href="#main-content">{t.a11y.skipToContent}</a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <StatsBar />
        <Services />
        <About />
        <Testimonials />
        <TrustedBy />
        <CTA />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
export default HomePage;
