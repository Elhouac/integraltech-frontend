import { ChevronRight } from "lucide-react";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

/* ── Workflow statuses ── */
const STATUSES = [
  { key: "draft", label: "Brouillon", color: "#94A3B8", description: "L'éditeur crée ou modifie un article." },
  { key: "pending_review", label: "En révision", color: "#F59E0B", description: "L'éditeur soumet l'article pour approbation." },
  { key: "changes_requested", label: "Modifications demandées", color: "#EF4444", description: "L'admin demande des modifications." },
  { key: "approved", label: "Approuvé", color: "#22C55E", description: "L'admin approuve l'article." },
  { key: "scheduled", label: "Planifié", color: "#3B82F6", description: "L'article est programmé pour publication future." },
  { key: "published", label: "Publié", color: "#22C55E", description: "L'article est visible sur le site." },
  { key: "archived", label: "Archivé", color: "#64748B", description: "L'article est retiré du site." },
] as const;

export default function BlogWorkflowDisplay() {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>
          Workflow de publication
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          Parcours d'un article de la rédaction à la publication. Lecture seule.
        </p>
      </div>

      <div style={{ padding: 24 }}>
        {/* Visual pipeline */}
        <div className="admin-settings-workflow" role="list" aria-label="Étapes du workflow">
          {STATUSES.map((status, index) => (
            <div key={status.key} style={{ display: "contents" }} role="listitem">
              <div className="admin-settings-workflow-step">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: status.color,
                    flexShrink: 0,
                  }}
                />
                {status.label}
              </div>
              {index < STATUSES.length - 1 && (
                <ChevronRight size={14} className="admin-settings-workflow-arrow" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        {/* Status descriptions */}
        <div
          style={{
            marginTop: 24,
            display: "grid",
            gap: 12,
          }}
        >
          {STATUSES.map((status) => (
            <div
              key={status.key}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
                color: TEXT_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: "var(--radius-sm)",
                  background: `${status.color}15`,
                  color: status.color,
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: status.color }} />
                {status.label}
              </span>
              <span>{status.description}</span>
            </div>
          ))}
        </div>

        {/* Read-only notice */}
        <div
          style={{
            marginTop: 20,
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--background)",
            border: `1px solid ${BORDER}`,
            fontSize: 12,
            color: TEXT_SECONDARY,
            fontFamily: "var(--font-sans)",
            fontStyle: "italic",
          }}
        >
          Ce workflow sera implémenté lors de la phase Blog avancée. Affiché ici à titre informatif uniquement.
        </div>
      </div>
    </div>
  );
}
