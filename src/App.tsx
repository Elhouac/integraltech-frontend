import { type ReactNode } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import { ThemeProvider } from "./context/ThemeContext";
import { PageTransitionProvider } from "./context/PageTransitionContext";
import { AuthProvider } from "./context/AuthContext";
import GlobalSearch from "./components/ui/GlobalSearch";
import BackToTop from "./components/ui/BackToTop";
import AdminLayout from "./components/admin/layout/AdminLayout";
import ProtectedRoute from "./components/admin/auth/ProtectedRoute";
import LoginPage from "./pages/admin/LoginPage";
import ForgotPasswordPage from "./pages/admin/ForgotPasswordPage";
import ResetPasswordPage from "./pages/admin/ResetPasswordPage";
import DashboardPage from "./pages/admin/DashboardPage";

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
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <SearchProvider>
              <PageTransitionProvider>
                <GlobalSearch />
                <BackToTop />
                <Routes>
                  {/* ── Public Routes ── */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/about" element={<AppShell><AboutPage /></AppShell>} />
                  <Route path="/solutions" element={<AppShell><SolutionsPage /></AppShell>} />
                  <Route path="/services" element={<AppShell><ServicesPage /></AppShell>} />
                  <Route path="/blog" element={<AppShell><BlogPage /></AppShell>} />
                  <Route path="/contact" element={<AppShell><ContactPage /></AppShell>} />

                  {/* ── Admin Auth Pages (standalone, no layout) ── */}
                  <Route path="/admin/login" element={<LoginPage />} />
                  <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

                  {/* ── Admin Protected Routes ── */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="*" element={<div style={{ padding: 40, fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--text)" }}>Page en construction</div>} />
                  </Route>
                </Routes>
              </PageTransitionProvider>
            </SearchProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}