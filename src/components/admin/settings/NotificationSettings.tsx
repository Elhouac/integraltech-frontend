import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { RotateCcw } from "lucide-react";
import type { SettingsTabProps } from "../../../pages/admin/SettingsPage";
import BlogWorkflowDisplay from "./BlogWorkflowDisplay";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

/* ── Types ── */
interface NotificationToggle {
  key: string;
  title: string;
  description: string;
}

const NOTIFICATION_ITEMS: NotificationToggle[] = [
  {
    key: "newContact",
    title: "Nouveau message de contact",
    description: "Un email est envoyé lorsqu'un visiteur soumet le formulaire de contact.",
  },
  {
    key: "newQuote",
    title: "Nouvelle demande de devis",
    description: "Notification lors d'une demande de devis.",
  },
  {
    key: "newSubscriber",
    title: "Nouvel abonné newsletter",
    description: "Notification quand un visiteur s'inscrit à la newsletter.",
  },
  {
    key: "articleSubmitted",
    title: "Article soumis pour révision",
    description: "Un éditeur a soumis un article pour approbation.",
  },
  {
    key: "articleApproved",
    title: "Article approuvé",
    description: "L'administrateur a approuvé un article.",
  },
  {
    key: "changesRequested",
    title: "Modifications demandées",
    description: "Des changements ont été demandés sur un article.",
  },
  {
    key: "emailFailed",
    title: "Échec d'envoi email",
    description: "Alerte en cas d'échec d'envoi d'un email.",
  },
];

type NotifState = Record<string, boolean>;

const DEFAULTS: NotifState = Object.fromEntries(
  NOTIFICATION_ITEMS.map((item) => [item.key, true]),
);

export default function NotificationSettings({ onDirtyChange, onSaveSuccess }: SettingsTabProps) {
  const [state, setState] = useState<NotifState>({ ...DEFAULTS });
  const [savedState, setSavedState] = useState<NotifState>({ ...DEFAULTS });
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const isDirty = useMemo(() => JSON.stringify(state) !== JSON.stringify(savedState), [state, savedState]);

  useEffect(() => { onDirtyChange(isDirty); }, [isDirty, onDirtyChange]);

  const toggle = useCallback((key: string) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    if (!mountedRef.current) return;
    setSavedState({ ...state });
    setSaving(false);
    onSaveSuccess();
  };

  const handleCancel = () => setState({ ...savedState });
  const handleReset = () => setState({ ...DEFAULTS });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Notification toggles */}
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
            Notifications
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            Choisissez quelles notifications email recevoir.
          </p>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 0 }}>
          {NOTIFICATION_ITEMS.map((item, index) => (
            <div
              key={item.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "16px 0",
                borderBottom: index < NOTIFICATION_ITEMS.length - 1 ? `1px solid ${BORDER}` : "none",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: TEXT,
                    fontFamily: "var(--font-sans)",
                    marginBottom: 2,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: TEXT_SECONDARY,
                    fontFamily: "var(--font-sans)",
                    lineHeight: 1.45,
                  }}
                >
                  {item.description}
                </div>
              </div>

              <label className="admin-toggle" aria-label={`${item.title} ${state[item.key] ? "activé" : "désactivé"}`}>
                <input
                  type="checkbox"
                  checked={state[item.key]}
                  onChange={() => toggle(item.key)}
                />
                <span className="admin-toggle-track" />
                <span className="admin-toggle-thumb" />
              </label>
            </div>
          ))}

          {/* ── Action bar ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 20,
              paddingTop: 20,
              borderTop: `1px solid ${BORDER}`,
              flexWrap: "wrap",
            }}
          >
            <button type="button" onClick={handleReset} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: "var(--radius-md)", border: `1px solid ${BORDER}`, background: "transparent", color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <RotateCcw size={14} />
              Réinitialiser
            </button>
            <button type="button" onClick={handleCancel} disabled={!isDirty} style={{ padding: "9px 20px", borderRadius: "var(--radius-md)", border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: isDirty ? "pointer" : "not-allowed", opacity: isDirty ? 1 : 0.5 }}>
              Annuler
            </button>
            <button type="button" onClick={handleSave} disabled={saving || !isDirty} style={{ padding: "9px 24px", borderRadius: "var(--radius-md)", border: "none", background: ACCENT, color: "#fff", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: saving || !isDirty ? "not-allowed" : "pointer", opacity: saving || !isDirty ? 0.6 : 1 }}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Blog Workflow Display ── */}
      <BlogWorkflowDisplay />
    </div>
  );
}
