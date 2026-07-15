import { type ReactNode, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
// ── Lazy-loaded public pages ──
const HomePage = lazy(() => import("./HomePage"));
const AboutPage = lazy(() => import("./pages/About"));
const SolutionsPage = lazy(() => import("./pages/Solutions"));
const ServicesPage = lazy(() => import("./pages/Services"));
const BlogPage = lazy(() => import("./pages/Blog"));
const ContactPage = lazy(() => import("./pages/Contact"));
const Home = lazy(() => import("./pages/Home"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
import { SearchProvider } from "./context/SearchContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PageTransitionProvider } from "./context/PageTransitionContext";
import { AuthProvider } from "./context/AuthContext";
import GlobalSearch from "./components/ui/GlobalSearch";
import BackToTop from "./components/ui/BackToTop";
import { ErrorBoundary } from "./components/error/ErrorBoundary";

// ── Lazy-loaded admin modules (code-split from public bundle) ──
const AdminLayout = lazy(() => import("./components/admin/layout/AdminLayout"));
const ProtectedRoute = lazy(() => import("./components/admin/auth/ProtectedRoute"));
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/admin/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/admin/ResetPasswordPage"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const LeadsPage = lazy(() => import("./pages/admin/LeadsPage"));
const LeadDetailPage = lazy(() => import("./pages/admin/LeadDetailPage"));
const SubscribersPage = lazy(() => import("./pages/admin/SubscribersPage"));
const PostsPage = lazy(() => import("./pages/admin/PostsPage"));
const PostCreatePage = lazy(() => import("./pages/admin/PostCreatePage"));
const PostEditPage = lazy(() => import("./pages/admin/PostEditPage"));
const CategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));

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

// ── Suspense fallback for public route loading ──
function PublicFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "2px solid var(--border)",
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
                  <Route path="/" element={<ErrorBoundary><Suspense fallback={<PublicFallback />}><HomePage /></Suspense></ErrorBoundary>} />
                  <Route path="/home" element={<ErrorBoundary><Suspense fallback={<PublicFallback />}><Home /></Suspense></ErrorBoundary>} />
                  <Route path="/about" element={<AppShell><ErrorBoundary><Suspense fallback={<PublicFallback />}><AboutPage /></Suspense></ErrorBoundary></AppShell>} />
                  <Route path="/solutions" element={<AppShell><ErrorBoundary><Suspense fallback={<PublicFallback />}><SolutionsPage /></Suspense></ErrorBoundary></AppShell>} />
                  <Route path="/services" element={<AppShell><ErrorBoundary><Suspense fallback={<PublicFallback />}><ServicesPage /></Suspense></ErrorBoundary></AppShell>} />
                  <Route path="/blog" element={<AppShell><ErrorBoundary><Suspense fallback={<PublicFallback />}><BlogPage /></Suspense></ErrorBoundary></AppShell>} />
                  <Route path="/contact" element={<AppShell><ErrorBoundary><Suspense fallback={<PublicFallback />}><ContactPage /></Suspense></ErrorBoundary></AppShell>} />

                  {/* ── Admin Auth Pages (lazy-loaded, standalone) ── */}
                  <Route path="/admin/login" element={<Suspense fallback={<AdminFallback />}><LoginPage /></Suspense>} />
                  <Route path="/admin/forgot-password" element={<Suspense fallback={<AdminFallback />}><ForgotPasswordPage /></Suspense>} />
                  <Route path="/admin/reset-password" element={<Suspense fallback={<AdminFallback />}><ResetPasswordPage /></Suspense>} />

                  {/* ── Admin Protected Routes (lazy-loaded) ── */}
                  <Route
                    path="/admin"
                    element={
                      <ErrorBoundary>
                        <Suspense fallback={<AdminFallback />}>
                          <ProtectedRoute>
                            <AdminLayout />
                          </ProtectedRoute>
                        </Suspense>
                      </ErrorBoundary>
                    }
                  >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="dashboard" action="view"><DashboardPage /></ProtectedRoute></Suspense>} />
                    <Route path="leads" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="leads" action="view"><LeadsPage /></ProtectedRoute></Suspense>} />
                    <Route path="leads/:id" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="leads" action="view"><LeadDetailPage /></ProtectedRoute></Suspense>} />
                    <Route path="subscribers" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="subscribers" action="view"><SubscribersPage /></ProtectedRoute></Suspense>} />
                    <Route path="posts" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="blog" action="view"><PostsPage /></ProtectedRoute></Suspense>} />
                    <Route path="posts/create" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="blog" action="create"><PostCreatePage /></ProtectedRoute></Suspense>} />
                    <Route path="posts/:id/edit" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="blog" action="edit"><PostEditPage /></ProtectedRoute></Suspense>} />
                    <Route path="categories" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="categories" action="view"><CategoriesPage /></ProtectedRoute></Suspense>} />
                    <Route path="users" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="users" action="view"><UsersPage /></ProtectedRoute></Suspense>} />
                    <Route path="*" element={<div style={{ padding: 40, fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--text)" }}>Page en construction</div>} />
                  </Route>
                  <Route path="*" element={<AppShell><ErrorBoundary><Suspense fallback={<PublicFallback />}><NotFoundPage /></Suspense></ErrorBoundary></AppShell>} />
                </Routes>
              </PageTransitionProvider>
            </SearchProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}