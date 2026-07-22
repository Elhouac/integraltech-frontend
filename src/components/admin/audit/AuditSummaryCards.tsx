import React from "react";
import { Activity, Clock, CheckCircle2, AlertTriangle, ShieldAlert, Zap } from "lucide-react";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

interface AuditSummaryCardsProps {
  summary: {
    total: number;
    today: number;
    success: number;
    deniedFailed: number;
    highCritical: number;
    currentSession: number;
  };
}

export default function AuditSummaryCards({ summary }: AuditSummaryCardsProps) {
  return (
    <div className="admin-notif-summary-cards">
      <div className="admin-notif-summary-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            Événements visibles
          </span>
          <Activity size={16} style={{ color: TEXT_SECONDARY }} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT }}>
          {summary.total}
        </span>
      </div>

      <div className="admin-notif-summary-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            Aujourd’hui
          </span>
          <Clock size={16} style={{ color: TEXT_SECONDARY }} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT }}>
          {summary.today}
        </span>
      </div>

      <div className="admin-notif-summary-card" style={{ borderLeft: `3px solid #22c55e` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#22c55e", fontFamily: "var(--font-sans)" }}>
            Réussis
          </span>
          <CheckCircle2 size={16} style={{ color: "#22c55e" }} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT }}>
          {summary.success}
        </span>
      </div>

      <div className="admin-notif-summary-card" style={{ borderLeft: summary.deniedFailed > 0 ? `3px solid ${DANGER}` : undefined }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: summary.deniedFailed > 0 ? DANGER : TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            Refusés / Échecs
          </span>
          <AlertTriangle size={16} style={{ color: summary.deniedFailed > 0 ? DANGER : TEXT_SECONDARY }} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: summary.deniedFailed > 0 ? DANGER : TEXT }}>
          {summary.deniedFailed}
        </span>
      </div>

      <div className="admin-notif-summary-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: ACCENT, fontFamily: "var(--font-sans)" }}>
            Élevés / Critiques
          </span>
          <ShieldAlert size={16} style={{ color: ACCENT }} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT }}>
          {summary.highCritical}
        </span>
      </div>

      <div className="admin-notif-summary-card" style={{ borderLeft: `3px solid ${ACCENT}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: ACCENT, fontFamily: "var(--font-sans)" }}>
            Session actuelle
          </span>
          <Zap size={16} style={{ color: ACCENT }} />
        </div>
        <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-display)", color: ACCENT }}>
          {summary.currentSession}
        </span>
      </div>
    </div>
  );
}
