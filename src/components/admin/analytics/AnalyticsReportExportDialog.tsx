import { useEffect, useRef, useState } from "react";
import { Download, FileCode, FileSpreadsheet, Info, X } from "lucide-react";
import type { UserRole } from "../../../context/AuthContext";
import type {
  AnalyticsDateRange,
  AnalyticsExportReport,
  AnalyticsSectionId,
} from "../../../types/admin";
import { adminService } from "../../../services/adminService";

interface AnalyticsReportExportDialogProps {
  open: boolean;
  userId: number;
  role: UserRole;
  range: AnalyticsDateRange;
  sectionIds: AnalyticsSectionId[];
  onClose: () => void;
  onSuccess: (message: string) => void;
}

function escapeCsv(value: string | number): string {
  const normalized = String(value).replace(/"/g, '""');
  return `"${normalized}"`;
}

export default function AnalyticsReportExportDialog({
  open,
  userId,
  role,
  range,
  sectionIds,
  onClose,
  onSuccess,
}: AnalyticsReportExportDialogProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [report, setReport] = useState<AnalyticsExportReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    setError(false);
    setReport(null);
    adminService.exportAnalyticsReport(userId, role, range, sectionIds)
      .then((data) => {
        if (active) setReport(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [open, userId, role, range, sectionIds]);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>("button, input, select, textarea, [tabindex]:not([tabindex='-1'])")?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
      ));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const download = () => {
    if (!report) return;
    const content = format === "json"
      ? JSON.stringify(report, null, 2)
      : [
          ["Section", "Groupe", "Indicateur", "Valeur"].map(escapeCsv).join(","),
          ...report.rows.map((row) => [row.section, row.group, row.indicator, row.value].map(escapeCsv).join(",")),
        ].join("\n");
    const blob = new Blob([content], { type: format === "json" ? "application/json;charset=utf-8" : "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report.filenameBase}.${format}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    onSuccess(`Rapport ${format.toUpperCase()} généré localement avec ${report.rows.length} ligne(s) agrégée(s).`);
    onClose();
  };

  return (
    <div className="admin-analytics-dialog-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="admin-analytics-dialog" role="dialog" aria-modal="true" aria-labelledby="analytics-export-title" aria-describedby="analytics-export-description">
        <header>
          <div>
            <Download size={18} aria-hidden="true" />
            <h2 id="analytics-export-title">Exporter le rapport</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer la fenêtre d’export"><X size={18} /></button>
        </header>

        <div className="admin-analytics-dialog-body">
          <div className="admin-analytics-export-warning">
            <Info size={16} aria-hidden="true" />
            <p id="analytics-export-description">Export local de démonstration : le rapport est généré dans le navigateur et non par le serveur.</p>
          </div>

          <div aria-live="polite">
            {loading && <p>Préparation des agrégats autorisés...</p>}
            {error && <p role="alert">Le rapport n’a pas pu être préparé. Fermez cette fenêtre puis réessayez.</p>}
            {report && (
              <dl className="admin-analytics-export-summary">
                <div><dt>Période</dt><dd>{report.rangeLabel}</dd></div>
                <div><dt>Sections incluses</dt><dd>{report.includedSections.join(", ") || "Aucune"}</dd></div>
                <div><dt>Lignes exportées</dt><dd>{report.rows.length}</dd></div>
              </dl>
            )}
          </div>

          <fieldset disabled={!report || loading}>
            <legend>Format du rapport</legend>
            <label className={format === "csv" ? "selected" : undefined}>
              <input type="radio" name="analytics-export-format" value="csv" checked={format === "csv"} onChange={() => setFormat("csv")} />
              <FileSpreadsheet size={18} aria-hidden="true" /> CSV
            </label>
            <label className={format === "json" ? "selected" : undefined}>
              <input type="radio" name="analytics-export-format" value="json" checked={format === "json"} onChange={() => setFormat("json")} />
              <FileCode size={18} aria-hidden="true" /> JSON
            </label>
          </fieldset>
        </div>

        <footer>
          <button type="button" className="secondary" onClick={onClose}>Annuler</button>
          <button type="button" className="primary" onClick={download} disabled={!report || loading || report.rows.length === 0}>
            <Download size={15} aria-hidden="true" /> Télécharger
          </button>
        </footer>
      </section>
    </div>
  );
}
