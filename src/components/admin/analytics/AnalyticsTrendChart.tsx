import { BarChart3 } from "lucide-react";
import type { AnalyticsTimeSeriesPoint } from "../../../types/admin";

interface AnalyticsTrendChartProps {
  title: string;
  description: string;
  points: AnalyticsTimeSeriesPoint[];
}

export default function AnalyticsTrendChart({ title, description, points }: AnalyticsTrendChartProps) {
  if (points.length === 0) {
    return (
      <section className="admin-analytics-panel" aria-labelledby={`${title}-empty`}>
        <div className="admin-analytics-empty-inline">
          <BarChart3 size={24} aria-hidden="true" />
          <h3 id={`${title}-empty`}>{title}</h3>
          <p>Donnée indisponible en mode démonstration pour cette série temporelle.</p>
        </div>
      </section>
    );
  }

  const width = 720;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 44, left: 42 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(1, ...points.map((point) => point.value));
  const x = (index: number) => padding.left + (points.length === 1 ? chartWidth / 2 : (index / (points.length - 1)) * chartWidth);
  const y = (value: number) => padding.top + chartHeight - (value / maxValue) * chartHeight;
  const polyline = points.map((point, index) => `${x(index)},${y(point.value)}`).join(" ");
  const labelStep = Math.max(1, Math.ceil(points.length / 6));
  const titleId = `analytics-chart-${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;

  return (
    <section className="admin-analytics-panel" aria-labelledby={titleId}>
      <div className="admin-analytics-section-heading">
        <div>
          <h3 id={titleId}>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="admin-analytics-chart-scroll">
        <svg
          className="admin-analytics-line-chart"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${titleId}-svg-title ${titleId}-svg-desc`}
        >
          <title id={`${titleId}-svg-title`}>{title}</title>
          <desc id={`${titleId}-svg-desc`}>{description} Les valeurs détaillées figurent dans le tableau suivant.</desc>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const lineY = padding.top + chartHeight - ratio * chartHeight;
            return (
              <g key={ratio}>
                <line x1={padding.left} x2={width - padding.right} y1={lineY} y2={lineY} className="grid-line" />
                <text x={padding.left - 8} y={lineY + 4} textAnchor="end" className="axis-label">
                  {Math.round(maxValue * ratio)}
                </text>
              </g>
            );
          })}
          <polyline points={polyline} className="trend-line" fill="none" />
          {points.map((point, index) => (
            <g key={`${point.date}-${index}`}>
              <circle cx={x(index)} cy={y(point.value)} r="4" className="trend-point">
                <title>{`${point.label} : ${point.value}`}</title>
              </circle>
              {(index % labelStep === 0 || index === points.length - 1) && (
                <text x={x(index)} y={height - 16} textAnchor="middle" className="axis-label">{point.label}</text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <details className="admin-analytics-chart-table">
        <summary>Afficher les données du graphique</summary>
        <div className="admin-analytics-table-scroll">
          <table>
            <caption>Données accessibles pour {title}</caption>
            <thead><tr><th scope="col">Période</th><th scope="col">Valeur</th></tr></thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.date}><th scope="row">{point.label}</th><td>{point.value}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
