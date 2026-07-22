import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Clock, HardDrive, Wifi, Monitor, Info, Lock } from "lucide-react";
import type { AdminAuditEvent } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, OVERLAY, DANGER } from "../../../constants";

interface AuditEventDetailsDialogProps {
  event: AdminAuditEvent | null;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AuditEventDetailsDialog({ event, onClose }: AuditEventDetailsDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!event) return null;

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
        aria-labelledby="audit-details-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 640,
            maxHeight: "90vh",
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-xl)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px 24px",
              borderBottom: `1px solid ${BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "var(--radius-sm)",
                  background: `${ACCENT}15`,
                  color: ACCENT,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Événement #{event.id}
              </span>
              <h2
                id="audit-details-title"
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: TEXT,
                }}
              >
                Détails de l'événement d'audit
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Fermer"
              style={{
                border: "none",
                background: "transparent",
                color: TEXT_SECONDARY,
                cursor: "pointer",
                padding: 4,
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div style={{ padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Overview Card */}
            <div
              style={{
                padding: 16,
                background: "var(--background)",
                border: `1px solid ${BORDER}`,
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, fontFamily: "var(--font-sans)" }}>
                {event.description}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <User size={13} /> <strong>Acteur:</strong> {event.actorDisplayName} ({event.actorRole})
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Clock size={13} /> <strong>Date:</strong> {formatDate(event.createdAt)}
                </span>
              </div>
            </div>

            {/* Technical Metadata */}
            <div>
              <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Contexte technique & Réseau
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                <div style={{ padding: 10, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Adresse IP</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <Wifi size={13} style={{ color: ACCENT }} />
                    {event.ipLabel}
                  </div>
                </div>

                <div style={{ padding: 10, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Appareil</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <Monitor size={13} style={{ color: ACCENT }} />
                    {event.deviceLabel}
                  </div>
                </div>

                <div style={{ padding: 10, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Session</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <HardDrive size={13} style={{ color: ACCENT }} />
                    {event.sessionLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Changes Table (Sanitized) */}
            {event.changes && event.changes.length > 0 && (
              <div>
                <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Modifications enregistrées
                </h3>
                <div style={{ border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-sans)" }}>
                    <thead>
                      <tr style={{ background: "var(--background)", textTransform: "uppercase", fontSize: 10, color: TEXT_SECONDARY }}>
                        <th style={{ padding: "8px 12px", textAlign: "left" }}>Champ</th>
                        <th style={{ padding: "8px 12px", textAlign: "left" }}>Avant</th>
                        <th style={{ padding: "8px 12px", textAlign: "left" }}>Après</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.changes.map((change, idx) => (
                        <tr key={idx} style={{ borderTop: idx > 0 ? `1px solid ${BORDER}` : undefined }}>
                          <td style={{ padding: "8px 12px", fontWeight: 600, color: TEXT }}>
                            {change.label || change.field}
                          </td>
                          {change.isSensitive ? (
                            <td colSpan={2} style={{ padding: "8px 12px", color: DANGER, fontStyle: "italic" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <Lock size={12} />
                                Valeur sensible non journalisée
                              </span>
                            </td>
                          ) : (
                            <>
                              <td style={{ padding: "8px 12px", color: TEXT_SECONDARY }}>
                                {change.before || "-"}
                              </td>
                              <td style={{ padding: "8px 12px", color: TEXT, fontWeight: 500 }}>
                                {change.after || "-"}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Additional Metadata */}
            {event.metadata && event.metadata.length > 0 && (
              <div>
                <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Métadonnées complémentaires
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: 12, background: "var(--background)", border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)" }}>
                  {event.metadata.map((meta, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--font-sans)" }}>
                      <span style={{ color: TEXT_SECONDARY }}>{meta.label} :</span>
                      <span style={{ fontWeight: 600, color: TEXT }}>{meta.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read-Only Informational Notice */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", borderRadius: "var(--radius-md)", background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
              <Info size={14} style={{ flexShrink: 0, marginTop: 2, color: ACCENT }} />
              <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                La suppression et la modification du journal d'audit ne sont pas disponibles. Ce journal est en mode lecture seule et append-only.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "12px 24px", borderTop: `1px solid ${BORDER}`, background: "var(--background)", display: "flex", justifyContent: "flex-end" }}>
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
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
