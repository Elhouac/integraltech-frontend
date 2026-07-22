import React from "react";
import { Link } from "react-router-dom";
import { Eye, CheckCircle2, ShieldAlert, AlertTriangle, Clock, User, ExternalLink, Zap } from "lucide-react";
import type { AdminAuditEvent, AuditAction, AuditSeverity, AuditOutcome } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

interface AuditEventItemProps {
  event: AdminAuditEvent;
  onViewDetails: (event: AdminAuditEvent) => void;
  showActor?: boolean;
}

const ACTION_LABELS: Record<AuditAction, string> = {
  create: "Création",
  update: "Modification",
  duplicate: "Duplication",
  submit_review: "Soumission révision",
  request_changes: "Changements demandés",
  approve: "Approbation",
  publish: "Publication",
  archive: "Archivage",
  restore: "Restauration",
  delete: "Suppression",
  bulk_update: "Action groupée",
  preference_update: "Préférences",
  profile_update: "Mise à jour profil",
  avatar_update: "Photo de profil",
  password_change_simulation: "Mot de passe (Simulé)",
  session_revoke_simulation: "Révocation session",
  notification_read: "Notification lue",
  notification_archive: "Notification archivée",
  notification_delete: "Notification supprimée",
  notification_preferences_update: "Préférences notification",
  export: "Exportation",
  access_denied: "Accès refusé",
  system: "Système",
};

const SEVERITY_BADGES: Record<AuditSeverity, { label: string; bg: string; color: string }> = {
  info: { label: "Info", bg: "rgba(14, 165, 233, 0.12)", color: "#0ea5e9" },
  warning: { label: "Alerte", bg: "rgba(249, 115, 22, 0.12)", color: ACCENT },
  critical: { label: "Critique", bg: "rgba(239, 68, 68, 0.15)", color: DANGER },
};

const OUTCOME_ICONS: Record<AuditOutcome, React.ElementType> = {
  success: CheckCircle2,
  denied: ShieldAlert,
  failed: AlertTriangle,
};

function getResourceRoute(resourceType: string): string | null {
  switch (resourceType) {
    case "service":
      return "/admin/services";
    case "solution":
      return "/admin/solutions";
    case "media":
      return "/admin/media";
    case "profile":
    case "session":
      return "/admin/profile";
    case "notification":
    case "notification_preferences":
      return "/admin/notifications";
    case "post":
    case "category":
      return "/admin/posts";
    case "lead":
    case "subscriber":
      return "/admin/leads";
    case "settings":
      return "/admin/settings/general";
    default:
      return null;
  }
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AuditEventItem({ event, onViewDetails, showActor = true }: AuditEventItemProps) {
  const OutcomeIcon = OUTCOME_ICONS[event.outcome] || CheckCircle2;
  const severity = SEVERITY_BADGES[event.severity] || SEVERITY_BADGES.info;
  const targetRoute = getResourceRoute(event.resourceType);

  return (
    <tr>
      {/* Event ID & Date */}
      <td style={{ whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: TEXT, fontFamily: "var(--font-sans)" }}>
          #{event.id}
        </div>
        <div style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", marginTop: 2 }}>
          {formatDate(event.createdAt)}
        </div>
      </td>

      {/* Actor */}
      {showActor && (
        <td>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <User size={13} style={{ color: TEXT_SECONDARY }} />
            <span style={{ fontWeight: 600, fontSize: 13, color: TEXT, fontFamily: "var(--font-sans)" }}>
              {event.actorDisplayName}
            </span>
          </div>
          <div style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", textTransform: "capitalize" }}>
            {event.actorRole}
          </div>
        </td>
      )}

      {/* Action */}
      <td>
        <span style={{ fontWeight: 600, fontSize: 12, color: TEXT, fontFamily: "var(--font-sans)" }}>
          {ACTION_LABELS[event.action] || event.action}
        </span>
      </td>

      {/* Resource Label & Route Link */}
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: TEXT, fontFamily: "var(--font-sans)" }}>
            {event.resourceLabel}
          </span>
          {targetRoute && (
            <Link
              to={targetRoute}
              style={{ color: ACCENT, display: "inline-flex", alignItems: "center" }}
              title={`Accéder à ${targetRoute}`}
            >
              <ExternalLink size={12} />
            </Link>
          )}
        </div>
        <div style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", textTransform: "uppercase" }}>
          {event.resourceType}
        </div>
      </td>

      {/* Outcome & Severity */}
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span className={`admin-audit-outcome-badge ${event.outcome}`}>
            <OutcomeIcon size={12} />
            <span style={{ textTransform: "capitalize" }}>{event.outcome}</span>
          </span>

          <span
            style={{
              padding: "2px 6px",
              borderRadius: "var(--radius-sm)",
              fontSize: 10,
              fontWeight: 700,
              background: severity.bg,
              color: severity.color,
              fontFamily: "var(--font-sans)",
            }}
          >
            {severity.label}
          </span>
        </div>
      </td>

      {/* Source */}
      <td>
        <span className={`admin-audit-source-badge ${event.source}`}>
          {event.source === "current_session" ? <Zap size={10} /> : <Clock size={10} />}
          <span>{event.source === "current_session" ? "Session actuelle" : "Démonstration"}</span>
        </span>
      </td>

      {/* Actions / Details */}
      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
        <button
          onClick={() => onViewDetails(event)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 12px",
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: SURFACE,
            color: TEXT,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            transition: "background 0.15s",
          }}
        >
          <Eye size={13} />
          <span>Détails</span>
        </button>
      </td>
    </tr>
  );
}
