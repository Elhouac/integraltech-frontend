import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileSpreadsheet, FileCode, Info } from "lucide-react";
import { adminService } from "../../../services/adminService";
import type { AdminAuditEvent } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, OVERLAY } from "../../../constants";

interface AuditExportDialogProps {
  open: boolean;
  events: AdminAuditEvent[];
  userId: number;
  userDisplayName: string;
  userRole: string;
  onClose: () => void;
  onExportSuccess: (count: number, format: "csv" | "json") => void;
}

export default function AuditExportDialog({
  open,
  events,
  userId,
  userDisplayName,
  userRole,
  onClose,
  onExportSuccess,
}: AuditExportDialogProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [exporting, setExporting] = useState(false);

  if (!open) return null;

  const handleDownload = async () => {
    setExporting(true);

    try {
      const nowStr = new Date().toISOString().slice(0, 10);
      const filename = `integraltech-audit-log-${nowStr}.${format}`;

      let content = "";
      let mimeType = "";

      if (format === "json") {
        mimeType = "application/json;charset=utf-8;";
        const sanitizedData = events.map((e) => ({
          id: e.id,
          createdAt: e.createdAt,
          actorDisplayName: e.actorDisplayName,
          actorRole: e.actorRole,
          action: e.action,
          resourceType: e.resourceType,
          resourceLabel: e.resourceLabel,
          description: e.description,
          severity: e.severity,
          outcome: e.outcome,
          source: e.source,
          ipLabel: e.ipLabel,
          deviceLabel: e.deviceLabel,
          changes: e.changes,
          metadata: e.metadata,
        }));
        content = JSON.stringify(sanitizedData, null, 2);
      } else {
        mimeType = "text/csv;charset=utf-8;";
        const headers = ["ID", "Date", "Acteur", "Rôle", "Action", "Ressource", "Nom Ressource", "Description", "Résultat", "Sévérité", "Source", "IP"];
        const rows = events.map((e) => [
          e.id,
          `"${e.createdAt}"`,
          `"${e.actorDisplayName.replace(/"/g, '""')}"`,
          `"${e.actorRole}"`,
          `"${e.action}"`,
          `"${e.resourceType}"`,
          `"${e.resourceLabel.replace(/"/g, '""')}"`,
          `"${e.description.replace(/"/g, '""')}"`,
          `"${e.outcome}"`,
          `"${e.severity}"`,
          `"${e.source}"`,
          `"${e.ipLabel}"`,
        ]);

        content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Record in-memory audit event for export action
      await adminService.appendCurrentSessionAuditEvent({
        actorUserId: userId,
        actorDisplayName: userDisplayName,
        actorRole: userRole,
        action: "export",
        resourceType: "system",
        resourceLabel: `Export Audit Log (${format.toUpperCase()})`,
        description: `Exportation de ${events.length} enregistrement(s) au format ${format.toUpperCase()}.`,
        severity: "info",
        outcome: "success",
        metadata: [
          { label: "Format", value: format.toUpperCase() },
          { label: "Nombre d'enregistrements", value: String(events.length) },
        ],
        ipLabel: "192.0.2.xxx",
        deviceLabel: "Navigateur actuel",
        sessionLabel: "Session actuelle",
      });

      onExportSuccess(events.length, format);
      onClose();
    } catch {
      /* ignore */
    } finally {
      setExporting(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: OVERLAY,
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 16,
        }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-export-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 480,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-xl)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Download size={18} style={{ color: ACCENT }} />
              <h2 id="audit-export-title" style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>
                Exporter le journal d'activité
              </h2>
            </div>
            <button onClick={onClose} style={{ border: "none", background: "transparent", color: TEXT_SECONDARY, cursor: "pointer" }}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", borderRadius: "var(--radius-md)", background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: 2, color: ACCENT }} />
              <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                Export local de démonstration : aucun fichier n’est généré par le serveur. Seuls les enregistrements autorisés et filtrés seront exportés.
              </span>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginBottom: 8 }}>
                Enregistrements prêts pour l'exportation :
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT, fontFamily: "var(--font-sans)", padding: "8px 12px", background: "var(--background)", borderRadius: "var(--radius-md)", border: `1px solid ${BORDER}` }}>
                {events.length} événement(s) d'audit filtré(s)
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginBottom: 8 }}>
                Choisir le format d'exportation :
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setFormat("csv")}
                  className={`admin-profile-pref-option${format === "csv" ? " selected" : ""}`}
                  style={{ justifyContent: "center" }}
                >
                  <FileSpreadsheet size={18} style={{ color: format === "csv" ? ACCENT : TEXT_SECONDARY }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>CSV (Tableur)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat("json")}
                  className={`admin-profile-pref-option${format === "json" ? " selected" : ""}`}
                  style={{ justifyContent: "center" }}
                >
                  <FileCode size={18} style={{ color: format === "json" ? ACCENT : TEXT_SECONDARY }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>JSON (Données)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, background: "var(--background)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                border: `1px solid ${BORDER}`,
                borderRadius: "var(--radius-md)",
                background: SURFACE,
                color: TEXT,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
            <button
              onClick={handleDownload}
              disabled={exporting || events.length === 0}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                border: "none",
                borderRadius: "var(--radius-md)",
                background: ACCENT,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                opacity: exporting || events.length === 0 ? 0.6 : 1,
              }}
            >
              <Download size={14} />
              <span>Télécharger ({format.toUpperCase()})</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
