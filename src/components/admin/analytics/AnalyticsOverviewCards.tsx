import {
  Archive,
  Bell,
  FileText,
  FolderOpen,
  Image,
  Inbox,
  Mail,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AnalyticsMetric } from "../../../types/admin";

interface AnalyticsOverviewCardsProps {
  metrics: AnalyticsMetric[];
}

function formatBytes(value: number): string {
  if (value === 0) return "0 o";
  const units = ["o", "Ko", "Mo", "Go"];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(value / 1024 ** index)} ${units[index]}`;
}

function formatMetricValue(metric: AnalyticsMetric): string {
  if (metric.value === null) return "Donnée indisponible en mode démonstration";
  if (metric.format === "bytes") return formatBytes(metric.value);
  return new Intl.NumberFormat("fr-FR").format(metric.value);
}

function getMetricIcon(id: string): LucideIcon {
  if (id.startsWith("posts")) return FileText;
  if (id.startsWith("services") || id.startsWith("solutions")) return Wrench;
  if (id.startsWith("categories")) return FolderOpen;
  if (id.startsWith("media")) return Image;
  if (id.startsWith("leads")) return Inbox;
  if (id.startsWith("subscribers")) return Mail;
  if (id.startsWith("users")) return Users;
  if (id.startsWith("notifications")) return Bell;
  if (id.startsWith("audit")) return ShieldCheck;
  return Archive;
}

function getComparisonLabel(metric: AnalyticsMetric): string {
  if (metric.value === null || metric.previousValue === null || metric.difference === null) {
    return "Comparaison indisponible";
  }

  const difference = `${metric.difference > 0 ? "+" : ""}${new Intl.NumberFormat("fr-FR").format(metric.difference)}`;
  const percentage = metric.differencePercentage === null
    ? "—"
    : `${metric.differencePercentage > 0 ? "+" : ""}${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(metric.differencePercentage)} %`;
  const direction = metric.trend === "up" ? "Hausse" : metric.trend === "down" ? "Baisse" : "Stable";
  return `${direction}, écart ${difference}, ${percentage}`;
}

export default function AnalyticsOverviewCards({ metrics }: AnalyticsOverviewCardsProps) {
  if (metrics.length === 0) return null;

  return (
    <div className="admin-analytics-overview-grid">
      {metrics.map((metric) => {
        const Icon = getMetricIcon(metric.id);
        return (
          <article className="admin-analytics-metric-card" key={metric.id} aria-label={`${metric.label} : ${formatMetricValue(metric)}`}>
            <div className="admin-analytics-metric-heading">
              <span>{metric.label}</span>
              <Icon size={17} aria-hidden="true" />
            </div>
            <strong className={metric.value === null ? "is-unavailable" : undefined}>{formatMetricValue(metric)}</strong>
            <p>{metric.description}</p>
            <span className={`admin-analytics-comparison ${metric.trend}`}>
              {getComparisonLabel(metric)}
            </span>
          </article>
        );
      })}
    </div>
  );
}
