import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { BarChart3, Database, Download, Info, RefreshCw, ShieldCheck } from "lucide-react";
import AnalyticsOverviewCards from "../../../components/admin/analytics/AnalyticsOverviewCards";
import AnalyticsDateRangeFilter from "../../../components/admin/analytics/AnalyticsDateRangeFilter";
import AnalyticsTrendChart from "../../../components/admin/analytics/AnalyticsTrendChart";
import AnalyticsBreakdownChart from "../../../components/admin/analytics/AnalyticsBreakdownChart";
import AnalyticsDataTable from "../../../components/admin/analytics/AnalyticsDataTable";
import AnalyticsReportExportDialog from "../../../components/admin/analytics/AnalyticsReportExportDialog";
import { adminService } from "../../../services/adminService";
import { useAuth } from "../../../context/AuthContext";
import type {
  AnalyticsDateRange,
  AnalyticsFilterOptions,
  AnalyticsOverview,
  AnalyticsReportSection,
  AnalyticsSectionId,
  AnalyticsTableRow,
} from "../../../types/admin";
import "../../../styles/admin-analytics.css";

type AnalyticsTabId = "overview" | "content" | "leads" | "media" | "system";

interface AnalyticsTab {
  id: AnalyticsTabId;
  label: string;
  sectionIds: AnalyticsSectionId[];
}

const DEFAULT_FILTER_OPTIONS: AnalyticsFilterOptions = {
  ranges: [
    { value: "7d", label: "7 derniers jours" },
    { value: "30d", label: "30 derniers jours" },
    { value: "90d", label: "90 derniers jours" },
    { value: "all", label: "Toutes les données" },
  ],
  authorizedSections: [],
  canExport: false,
};

function buildTabs(sections: AnalyticsReportSection[]): AnalyticsTab[] {
  const available = new Set(sections.map((section) => section.id));
  const tabs: AnalyticsTab[] = [{ id: "overview", label: "Vue d’ensemble", sectionIds: sections.map((section) => section.id) }];
  if (available.has("content")) tabs.push({ id: "content", label: "Contenu", sectionIds: ["content"] });
  if (available.has("leads") || available.has("subscribers")) tabs.push({ id: "leads", label: "Prospects", sectionIds: ["leads", "subscribers"].filter((id): id is AnalyticsSectionId => available.has(id as AnalyticsSectionId)) });
  if (available.has("media")) tabs.push({ id: "media", label: "Médias", sectionIds: ["media"] });
  const systemIds = ["users", "notifications", "audit"].filter((id): id is AnalyticsSectionId => available.has(id as AnalyticsSectionId));
  if (systemIds.length > 0) tabs.push({ id: "system", label: "Activité système", sectionIds: systemIds });
  return tabs;
}

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const userId = user?.id ?? 0;
  const role = user?.role ?? "reader";
  const [range, setRange] = useState<AnalyticsDateRange>("30d");
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [filterOptions, setFilterOptions] = useState<AnalyticsFilterOptions>(DEFAULT_FILTER_OPTIONS);
  const [activeTab, setActiveTab] = useState<AnalyticsTabId>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    Promise.all([
      adminService.getAnalyticsFilterOptions(role),
      adminService.getAnalyticsOverview(userId, role, range),
    ])
      .then(([options, data]) => {
        if (!active) return;
        setFilterOptions(options);
        setOverview(data);
      })
      .catch(() => {
        if (!active) return;
        setOverview(null);
        setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [range, role, userId, reloadToken]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const tabs = useMemo(() => buildTabs(overview?.sections ?? []), [overview]);
  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) setActiveTab("overview");
  }, [activeTab, tabs]);

  const activeTabConfig = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const visibleSections = useMemo(() => {
    if (!overview || !activeTabConfig) return [];
    if (activeTab === "overview") return overview.sections;
    return overview.sections.filter((section) => activeTabConfig.sectionIds.includes(section.id));
  }, [activeTab, activeTabConfig, overview]);
  const exportSectionIds = useMemo(
    () => activeTabConfig?.sectionIds ?? [],
    [activeTabConfig]
  );

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    window.requestAnimationFrame(() => document.getElementById(`analytics-tab-${nextTab.id}`)?.focus());
  };

  const overviewTableRows = useMemo<AnalyticsTableRow[]>(() => {
    if (!overview) return [];
    return overview.overviewMetrics.map((metric) => ({
      id: metric.id,
      label: metric.label,
      values: {
        value: metric.value ?? "Indisponible",
        previous: metric.previousValue ?? "—",
        difference: metric.difference ?? "—",
      },
    }));
  }, [overview]);

  return (
    <div className="admin-analytics-page">
      <header className="admin-analytics-page-header">
        <div>
          <h1>Rapports & analyses</h1>
          <p>Indicateurs agrégés calculés depuis les données Admin temporaires actuellement autorisées.</p>
        </div>
        {filterOptions.canExport && (
          <button type="button" className="admin-analytics-export-button" onClick={() => setExportOpen(true)}>
            <Download size={16} aria-hidden="true" /> Exporter
          </button>
        )}
      </header>

      <div className="admin-analytics-demo-warning" role="status">
        <Info size={17} aria-hidden="true" />
        <span>Mode démonstration : les indicateurs sont calculés à partir des données temporaires du frontend et ne représentent pas des statistiques de production.</span>
      </div>

      <div className="admin-analytics-toolbar">
        <AnalyticsDateRangeFilter
          value={range}
          options={filterOptions.ranges}
          onChange={setRange}
          disabled={loading}
        />
        <p>Les données sont recalculées au chargement et lors d’un changement de période. Aucun suivi en temps réel n’est actif.</p>
      </div>

      {loading ? (
        <div className="admin-analytics-loading" role="status" aria-live="polite" aria-label="Chargement des analyses">
          <div className="admin-analytics-skeleton-grid">{Array.from({ length: 6 }).map((_, index) => <span key={index} />)}</div>
          <div className="admin-analytics-skeleton-chart" />
          <span className="admin-analytics-sr-only">Chargement des analyses...</span>
        </div>
      ) : error ? (
        <section className="admin-analytics-state" role="alert">
          <BarChart3 size={32} aria-hidden="true" />
          <h2>Impossible de calculer les indicateurs</h2>
          <p>Les données temporaires n’ont pas pu être agrégées. Aucun détail technique sensible n’est affiché.</p>
          <button type="button" onClick={() => setReloadToken((value) => value + 1)}><RefreshCw size={15} aria-hidden="true" /> Réessayer</button>
        </section>
      ) : !overview || overview.sections.length === 0 ? (
        <section className="admin-analytics-state">
          <ShieldCheck size={32} aria-hidden="true" />
          <h2>Aucune section autorisée</h2>
          <p>Votre rôle actuel ne permet pas de consulter des données analytiques agrégées.</p>
        </section>
      ) : (
        <>
          <nav className="admin-analytics-tabs" aria-label="Sections analytiques" role="tablist">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`analytics-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`analytics-panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={activeTab === tab.id ? "active" : undefined}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div
            id={`analytics-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`analytics-tab-${activeTab}`}
            className="admin-analytics-tab-panel"
          >
            {activeTab === "overview" ? (
              <>
                <section aria-labelledby="analytics-overview-title">
                  <div className="admin-analytics-section-heading">
                    <div>
                      <h2 id="analytics-overview-title">Vue d’ensemble autorisée</h2>
                      <p>Les cartes correspondent uniquement aux modules accessibles à votre rôle.</p>
                    </div>
                  </div>
                  <AnalyticsOverviewCards metrics={overview.overviewMetrics} />
                </section>

                <AnalyticsTrendChart
                  title="Activité agrégée autorisée"
                  description="Somme des créations et événements datés présents dans les sections actuellement autorisées."
                  points={overview.combinedTrend}
                />

                <div className="admin-analytics-breakdown-grid">
                  {overview.sections.flatMap((section) => section.breakdowns.slice(0, 1)).map((group) => (
                    <AnalyticsBreakdownChart key={group.id} group={group} />
                  ))}
                </div>

                <AnalyticsDataTable
                  title="Synthèse des indicateurs"
                  description="Valeurs agrégées principales et comparaison avec la période précédente lorsqu’elle est calculable."
                  columns={[
                    { key: "value", label: "Valeur", sortable: true },
                    { key: "previous", label: "Période précédente", sortable: true },
                    { key: "difference", label: "Écart", sortable: true },
                  ]}
                  rows={overviewTableRows}
                />
              </>
            ) : (
              visibleSections.map((section) => (
                <section className="admin-analytics-module" key={section.id} aria-labelledby={`analytics-section-${section.id}`}>
                  <div className="admin-analytics-section-heading">
                    <div>
                      <h2 id={`analytics-section-${section.id}`}>{section.title}</h2>
                      <p>{section.description}</p>
                    </div>
                  </div>
                  <AnalyticsOverviewCards metrics={section.metrics} />
                  <AnalyticsTrendChart title={section.trendTitle} description={section.trendDescription} points={section.trend} />
                  <div className="admin-analytics-breakdown-grid">
                    {section.breakdowns.map((group) => <AnalyticsBreakdownChart key={group.id} group={group} />)}
                  </div>
                  <AnalyticsDataTable
                    title={`Tableau agrégé : ${section.title}`}
                    description={`Détails agrégés autorisés pour la section ${section.title}.`}
                    columns={section.tableColumns}
                    rows={section.tableRows}
                  />
                </section>
              ))
            )}
          </div>

          <section className="admin-analytics-methodology" aria-labelledby="analytics-methodology-title">
            <div>
              <Database size={20} aria-hidden="true" />
              <h2 id="analytics-methodology-title">Méthodologie et limites</h2>
            </div>
            <ul>
              <li>Les indicateurs proviennent uniquement des enregistrements mock temporaires du frontend.</li>
              <li>Une actualisation peut réinitialiser les changements effectués pendant la session.</li>
              <li>Aucune base de données de production n’est interrogée.</li>
              <li>Aucun script de suivi, cookie analytique ou service de télémétrie n’est installé.</li>
              <li>Aucune donnée réelle de visiteurs, de revenus ou de performance commerciale n’est disponible.</li>
              <li>Les comparaisons utilisent uniquement les horodatages valides présents dans les données mock.</li>
              <li>Une version de production nécessite des API backend, des permissions, des règles de conservation et des sources validées.</li>
            </ul>
            {overview.ignoredInvalidDates > 0 && (
              <p role="status">{overview.ignoredInvalidDates} horodatage(s) invalide(s) ont été ignoré(s) sans interrompre le calcul.</p>
            )}
          </section>
        </>
      )}

      {filterOptions.canExport && (
        <AnalyticsReportExportDialog
          open={exportOpen}
          userId={userId}
          role={role}
          range={range}
          sectionIds={exportSectionIds}
          onClose={() => setExportOpen(false)}
          onSuccess={setToast}
        />
      )}

      {toast && <div className="admin-analytics-toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}
