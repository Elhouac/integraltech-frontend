import { type ReactNode, lazy, Suspense } from "react";
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

// ── Lazy-loaded admin modules (code-split from public bundle) ──
const AdminLayout = lazy(() => import("./components/admin/layout/AdminLayout"));
const ProtectedRoute = lazy(() => import("./components/admin/auth/ProtectedRoute"));
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/admin/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/admin/ResetPasswordPage"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const LeadsPage = lazy(() => import("./pages/admin/LeadsPage"));
const LeadDetailPage = lazy(() => import("./pages/admin/LeadDetailPage"));

// ── Suspense fallback for admin chunk loading ──
function AdminFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "var(--background)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid var(--border)",
          borderTopColor: "var(--accent)",
          borderRadius: "50%",
          animation: "admin-spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}

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

                  {/* ── Admin Auth Pages (lazy-loaded, standalone) ── */}
                  <Route path="/admin/login" element={<Suspense fallback={<AdminFallback />}><LoginPage /></Suspense>} />
                  <Route path="/admin/forgot-password" element={<Suspense fallback={<AdminFallback />}><ForgotPasswordPage /></Suspense>} />
                  <Route path="/admin/reset-password" element={<Suspense fallback={<AdminFallback />}><ResetPasswordPage /></Suspense>} />

                  {/* ── Admin Protected Routes (lazy-loaded) ── */}
                  <Route
                    path="/admin"
                    element={
                      <Suspense fallback={<AdminFallback />}>
                        <ProtectedRoute>
                          <AdminLayout />
                        </ProtectedRoute>
                      </Suspense>
                    }
                  >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Suspense fallback={<AdminFallback />}><DashboardPage /></Suspense>} />
                    <Route path="leads" element={<Suspense fallback={<AdminFallback />}><LeadsPage /></Suspense>} />
                    <Route path="leads/:id" element={<Suspense fallback={<AdminFallback />}><LeadDetailPage /></Suspense>} />
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