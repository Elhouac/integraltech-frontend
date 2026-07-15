import KpiCard from "./KpiCard";
import type { KpiData } from "../../../types/admin";

interface KpiGridProps {
  data: KpiData[];
}

export default function KpiGrid({ data }: KpiGridProps) {
  return (
    <div
      className="admin-kpi-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 20,
      }}
    >
      {data.map((kpi, index) => (
        <KpiCard key={kpi.label} {...kpi} index={index} />
      ))}
    </div>
  );
}
