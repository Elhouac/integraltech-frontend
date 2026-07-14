import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import KpiGrid from "../../components/admin/dashboard/KpiGrid";
import RecentActivity from "../../components/admin/dashboard/RecentActivity";
import QuickActions from "../../components/admin/dashboard/QuickActions";
import { MOCK_KPI_DATA, MOCK_ACTIVITIES, MOCK_QUICK_ACTIONS } from "../../data/admin-mocks";
import { TEXT, TEXT_SECONDARY } from "../../constants";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Admin";

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
      </motion.div>

      {/* ── KPI Cards ── */}
      <KpiGrid data={MOCK_KPI_DATA} />

      {/* ── Main Content: Activity + Quick Actions ── */}
      <div
        className="admin-dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 20,
          alignItems: "start",
        }}
      >
        <RecentActivity activities={MOCK_ACTIVITIES} />
        <QuickActions actions={MOCK_QUICK_ACTIONS} />
      </div>
    </div>
  );
}
