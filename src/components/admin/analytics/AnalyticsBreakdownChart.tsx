import { ChartNoAxesColumn } from "lucide-react";
import type { AnalyticsBreakdownGroup } from "../../../types/admin";

interface AnalyticsBreakdownChartProps {
  group: AnalyticsBreakdownGroup;
}

export default function AnalyticsBreakdownChart({ group }: AnalyticsBreakdownChartProps) {
  const total = group.items.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="admin-analytics-panel admin-analytics-breakdown" aria-labelledby={`breakdown-${group.id}`}>
      <div className="admin-analytics-section-heading">
        <div>
          <h3 id={`breakdown-${group.id}`}>{group.title}</h3>
          <p>{group.description}</p>
        </div>
      </div>

      {group.items.length === 0 ? (
        <div className="admin-analytics-empty-inline">
          <ChartNoAxesColumn size={22} aria-hidden="true" />
          <p>Aucune donnée agrégée disponible pour cette répartition.</p>
        </div>
      ) : (
        <ul aria-label={`${group.title}, total ${total}`}>
          {group.items.map((item) => (
            <li key={item.id}>
              <div className="admin-analytics-breakdown-label">
                <span>{item.label}</span>
                <strong>{item.value} ({new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(item.percentage)} %)</strong>
              </div>
              <div className="admin-analytics-bar-track" aria-hidden="true">
                <span style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
