import { Users, Inbox, FileText, Eye } from "lucide-react";
import KpiCard from "./KpiCard";

// ── Mock KPI data (replaced by API in Phase 2) ──
const KPI_DATA = [
  {
    icon: Inbox,
    iconColor: "#F97316",
    iconBg: "rgba(249,115,22,0.08)",
    label: "Leads ce mois",
    value: "128",
    trend: { value: "+12% vs mois dernier", direction: "up" as const },
  },
  {
    icon: Users,
    iconColor: "#3B82F6",
    iconBg: "rgba(59,130,246,0.08)",
    label: "Abonnés newsletter",
    value: "2,340",
    trend: { value: "+5.2% vs mois dernier", direction: "up" as const },
  },
  {
    icon: FileText,
    iconColor: "#22C55E",
    iconBg: "rgba(34,197,94,0.08)",
    label: "Articles publiés",
    value: "47",
    trend: { value: "3 cette semaine", direction: "neutral" as const },
  },
  {
    icon: Eye,
    iconColor: "#8B5CF6",
    iconBg: "rgba(139,92,246,0.08)",
    label: "Visiteurs (30j)",
    value: "12.4K",
    trend: { value: "-2.1% vs mois dernier", direction: "down" as const },
  },
];

export default function KpiGrid() {
  return (
    <div
      className="admin-kpi-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 20,
      }}
    >
      {KPI_DATA.map((kpi, index) => (
        <KpiCard key={kpi.label} {...kpi} index={index} />
      ))}
    </div>
  );
}
