import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import KpiGrid from "../../components/admin/dashboard/KpiGrid";
import RecentActivity from "../../components/admin/dashboard/RecentActivity";
import QuickActions from "../../components/admin/dashboard/QuickActions";
import { adminService } from "../../services/adminService";
import type { KpiData, ActivityData } from "../../types/admin";
import { MOCK_QUICK_ACTIONS } from "../../data/admin-mocks";
import { TEXT, TEXT_SECONDARY } from "../../constants";
import { hasPermission } from "../../utils/permissions";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Admin";

  const [kpis, setKpis] = useState<KpiData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const quickActions = useMemo(
    () => user ? MOCK_QUICK_ACTIONS.filter((item) => hasPermission(user.role, item.resource, item.action)) : [],
    [user]
  );

  const loadData = useCallback(async (isActive: () => boolean = () => true) => {
    if (!user) return;
    setIsLoading(true);
    setLoadError(false);
    try {
      const [kpiRes, actRes] = await Promise.all([
        adminService.getKpiData(user.role),
        adminService.getActivities(user.role),
      ]);
      if (isActive()) {
        setKpis(kpiRes);
        setActivities(actRes);
      }
    } catch (err) {
      console.error("Dashboard failed to load", err);
      if (isActive()) setLoadError(true);
    } finally {
      if (isActive()) setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    void loadData(() => active);
    return () => { active = false; };
  }, [loadData]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            color: TEXT,
            margin: 0,
          }}
        >
          {getGreeting()}, {firstName} 👋
        </h1>
        <p
          style={{
            fontSize: 14,
            color: TEXT_SECONDARY,
            fontFamily: "var(--font-sans)",
            marginTop: 4,
            margin: "4px 0 0",
          }}
        >
          Voici un aperçu de votre plateforme aujourd'hui.
        </p>
        <p className="admin-demo-notice" role="note">
          Données temporaires de démonstration : aucune statistique n'est issue d'un serveur et les changements sont réinitialisés au rechargement.
        </p>
      </motion.div>

      {/* ── KPI Cards ── */}
      {isLoading ? (
        <div style={{ padding: 20, color: TEXT_SECONDARY }}>Chargement des statistiques...</div>
      ) : loadError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          <span>Impossible de charger les données de démonstration.</span>
          <button type="button" onClick={() => void loadData()}>Réessayer</button>
        </div>
      ) : (
        <KpiGrid data={kpis} />
      )}

      {/* ── Main Content: Activity + Quick Actions ── */}
      <div
        className="admin-dashboard-grid"
        style={{
          display: "grid",
          gap: 20,
          alignItems: "start",
        }}
      >
        <RecentActivity activities={activities} />
        <QuickActions actions={quickActions} />
      </div>
    </div>
  );
}
