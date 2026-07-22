import { type ReactNode, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate, Link } from "react-router-dom";
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
import { LanguageProvider, useTranslation } from "./context/LanguageContext";
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
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const AdminServicesPage = lazy(() => import("./pages/admin/services/ServicesPage"));
const ServiceCreatePage = lazy(() => import("./pages/admin/services/ServiceCreatePage"));
const ServiceEditPage = lazy(() => import("./pages/admin/services/ServiceEditPage"));
const AdminSolutionsPage = lazy(() => import("./pages/admin/solutions/AdminSolutionsPage"));
const SolutionCreatePage = lazy(() => import("./pages/admin/solutions/SolutionCreatePage"));
const SolutionEditPage = lazy(() => import("./pages/admin/solutions/SolutionEditPage"));
const AdminMediaPage = lazy(() => import("./pages/admin/media/AdminMediaPage"));
const MediaCreatePage = lazy(() => import("./pages/admin/media/MediaCreatePage"));
const MediaEditPage = lazy(() => import("./pages/admin/media/MediaEditPage"));
const AdminProfilePage = lazy(() => import("./pages/admin/profile/AdminProfilePage"));
const AdminNotificationsPage = lazy(() => import("./pages/admin/notifications/AdminNotificationsPage"));
const AdminAuditLogPage = lazy(() => import("./pages/admin/audit/AdminAuditLogPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/analytics/AdminAnalyticsPage"));



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
      className="public-route-fallback"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        aria-hidden="true"
      />
    </div>
  );
}

function AdminNotFound() {
  return (
    <section className="admin-not-found" aria-labelledby="admin-not-found-title">
      <div className="admin-not-found-card">
        <div className="admin-not-found-code" aria-hidden="true">404</div>
        <h1 id="admin-not-found-title">Page introuvable</h1>
        <p>La page demandée n’existe pas ou n’est plus disponible.</p>
        <Link to="/admin/dashboard">Retour au dashboard</Link>
      </div>
    </section>
  );
}

function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslation();

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t.a11y.skipToContent}
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
                    <Route path="settings/general" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="settings" action="view"><SettingsPage /></ProtectedRoute></Suspense>} />
                    <Route path="services" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="services" action="view"><AdminServicesPage /></ProtectedRoute></Suspense>} />
                    <Route path="services/create" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="services" action="create"><ServiceCreatePage /></ProtectedRoute></Suspense>} />
                    <Route path="services/:id/edit" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="services" action="edit"><ServiceEditPage /></ProtectedRoute></Suspense>} />
                    <Route path="solutions" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="solutions" action="view"><AdminSolutionsPage /></ProtectedRoute></Suspense>} />
                    <Route path="solutions/create" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="solutions" action="create"><SolutionCreatePage /></ProtectedRoute></Suspense>} />
                    <Route path="solutions/:id/edit" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="solutions" action="edit"><SolutionEditPage /></ProtectedRoute></Suspense>} />
                    <Route path="media" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="media" action="view"><AdminMediaPage /></ProtectedRoute></Suspense>} />
                    <Route path="media/create" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="media" action="create"><MediaCreatePage /></ProtectedRoute></Suspense>} />
                    <Route path="media/:id/edit" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="media" action="edit"><MediaEditPage /></ProtectedRoute></Suspense>} />
                    <Route path="profile" element={<Suspense fallback={<AdminFallback />}><AdminProfilePage /></Suspense>} />
                    <Route path="notifications" element={<Suspense fallback={<AdminFallback />}><AdminNotificationsPage /></Suspense>} />
                    <Route path="audit-log" element={<Suspense fallback={<AdminFallback />}><AdminAuditLogPage /></Suspense>} />
                    <Route path="analytics" element={<Suspense fallback={<AdminFallback />}><ProtectedRoute resource="analytics" action="view"><AdminAnalyticsPage /></ProtectedRoute></Suspense>} />
                    <Route path="*" element={<AdminNotFound />} />
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
