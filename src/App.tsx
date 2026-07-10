import { type ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./HomePage";
import AboutPage from "./pages/About";
import SolutionsPage from "./pages/Solutions";
import ServicesPage from "./pages/Services";
import BlogPage from "./pages/Blog";
import ContactPage from "./pages/Contact";
import Home from "./pages/Home";
import { SearchProvider } from "./context/SearchContext";
import { LanguageProvider } from "./context/LanguageContext";
import { PageTransitionProvider } from "./context/PageTransitionContext";
import GlobalSearch from "./components/ui/GlobalSearch";
import BackToTop from "./components/ui/BackToTop";

function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        {/* Skip link text will be from translations but this is for accessibility */}
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <SearchProvider>
          <PageTransitionProvider>
            <GlobalSearch />
            <BackToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<AppShell><AboutPage /></AppShell>} />
              <Route path="/solutions" element={<AppShell><SolutionsPage /></AppShell>} />
              <Route path="/services" element={<AppShell><ServicesPage /></AppShell>} />
              <Route path="/blog" element={<AppShell><BlogPage /></AppShell>} />
              <Route path="/contact" element={<AppShell><ContactPage /></AppShell>} />
            </Routes>
          </PageTransitionProvider>
        </SearchProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}