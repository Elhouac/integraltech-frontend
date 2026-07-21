import React, { useState, useEffect } from "react";
import { Save, RotateCcw, Info, Bell, Shield, Moon, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "../../../services/adminService";
import type { NotificationPreferences, DigestFrequency } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

interface NotificationPreferencesPanelProps {
  userId: number;
}

const DIGEST_OPTIONS: { value: DigestFrequency; label: string }[] = [
  { value: "immediate", label: "Immédiat (Toutes les notifications)" },
  { value: "daily", label: "Résumé quotidien" },
  { value: "weekly", label: "Résumé hebdomadaire" },
  { value: "disabled", label: "Désactivé" },
];

const sectionStyle: React.CSSProperties = {
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: "var(--radius-lg)",
  overflow: "hidden",
  marginBottom: 20,
};
const sectionHeaderStyle: React.CSSProperties = { padding: "18px 24px", borderBottom: `1px solid ${BORDER}` };
const sectionTitleStyle: React.CSSProperties = { margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT };
const sectionBodyStyle: React.CSSProperties = { padding: 24 };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginBottom: 6 };
const helperStyle: React.CSSProperties = { fontSize: 12, color: TEXT_SECONDARY, marginTop: 4, fontFamily: "var(--font-sans)" };

export default function NotificationPreferencesPanel({ userId }: NotificationPreferencesPanelProps) {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    adminService.getNotificationPreferences(userId).then((data) => {
      setPrefs(data);
      setLoading(false);
    });
  }, [userId]);

  const handleSave = async () => {
    if (!prefs) return;
    setSaving(true);
    try {
      const updated = await adminService.updateNotificationPreferences(userId, prefs);
      setPrefs(updated);
      setToast("Préférences de notification enregistrées.");
      setTimeout(() => setToast(null), 3000);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  if (loading || !prefs) {
    return (
      <div style={{ padding: 32, textAlign: "center", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
        Chargement des préférences...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Simulation Warning */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 16px", borderRadius: "var(--radius-md)", background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: 2, color: ACCENT }} />
        <span style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
          Ces préférences sont simulées. L'application du calendrier et l'envoi réel de courriels ou notifications push nécessitent l'intégration du backend Laravel.
        </span>
      </div>

      {/* In-App Notifications */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Bell size={18} style={{ color: ACCENT }} />
            <h2 style={sectionTitleStyle}>Notifications In-App</h2>
          </div>
        </div>
        <div style={sectionBodyStyle}>
          <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={prefs.inAppEnabled}
              onChange={(e) => setPrefs({ ...prefs, inAppEnabled: e.target.checked })}
              style={{ width: 18, height: 18, accentColor: ACCENT, cursor: "pointer" }}
            />
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>
                Activer les notifications dans le tableau de bord
              </span>
              <div style={helperStyle}>Affiche les badges et le panneau de notification dans le menu d'en-tête.</div>
            </div>
          </label>
        </div>
      </div>

      {/* Alert Categories */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Catégories d'alertes</h2>
        </div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Content review */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={prefs.contentReviewEnabled}
                onChange={(e) => setPrefs({ ...prefs, contentReviewEnabled: e.target.checked })}
                style={{ width: 18, height: 18, marginTop: 2, accentColor: ACCENT, cursor: "pointer" }}
              />
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>
                  Relecture & Validation de contenu
                </span>
                <div style={helperStyle}>Demandes de révision pour les services, solutions et articles.</div>
              </div>
            </label>

            {/* Lead alerts */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={prefs.leadAlertsEnabled}
                onChange={(e) => setPrefs({ ...prefs, leadAlertsEnabled: e.target.checked })}
                style={{ width: 18, height: 18, marginTop: 2, accentColor: ACCENT, cursor: "pointer" }}
              />
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>
                  Nouveaux prospects & Leads
                </span>
                <div style={helperStyle}>Alertes lors de la réception de formulaires de contact ou demandes de devis.</div>
              </div>
            </label>

            {/* Media alerts */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={prefs.mediaAlertsEnabled}
                onChange={(e) => setPrefs({ ...prefs, mediaAlertsEnabled: e.target.checked })}
                style={{ width: 18, height: 18, marginTop: 2, accentColor: ACCENT, cursor: "pointer" }}
              />
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>
                  Bibliothèque média
                </span>
                <div style={helperStyle}>Fichiers ajoutés, modifiés ou révisés dans la médiathèque.</div>
              </div>
            </label>

            {/* Security alerts (mandatory) */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "not-allowed", opacity: 0.8 }}>
              <input
                type="checkbox"
                checked={true}
                disabled
                style={{ width: 18, height: 18, marginTop: 2, accentColor: ACCENT }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>
                    Alertes de sécurité & Connexions
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: "var(--radius-sm)", background: "rgba(239, 68, 68, 0.12)", color: "var(--danger)" }}>
                    Obligatoire
                  </span>
                </div>
                <div style={helperStyle}>Ces alertes critiques ne peuvent pas être désactivées pour des raisons de sécurité.</div>
              </div>
            </label>

            {/* Account alerts */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={prefs.accountAlertsEnabled}
                onChange={(e) => setPrefs({ ...prefs, accountAlertsEnabled: e.target.checked })}
                style={{ width: 18, height: 18, marginTop: 2, accentColor: ACCENT, cursor: "pointer" }}
              />
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>
                  Compte & Préférences
                </span>
                <div style={helperStyle}>Modifications du profil, de la langue ou des sessions actives.</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Quiet Hours */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Moon size={18} style={{ color: ACCENT }} />
            <h2 style={sectionTitleStyle}>Heures de tranquillité (Simulées)</h2>
          </div>
        </div>
        <div style={sectionBodyStyle}>
          <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={prefs.quietHoursEnabled}
              onChange={(e) => setPrefs({ ...prefs, quietHoursEnabled: e.target.checked })}
              style={{ width: 18, height: 18, accentColor: ACCENT, cursor: "pointer" }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>
              Activer la plage de silence
            </span>
          </label>

          {prefs.quietHoursEnabled && (
            <div className="admin-service-form-grid" style={{ maxWidth: 400 }}>
              <div>
                <label style={labelStyle}>Heure de début</label>
                <input
                  type="time"
                  value={prefs.quietHoursStart}
                  onChange={(e) => setPrefs({ ...prefs, quietHoursStart: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: 13,
                    fontFamily: "var(--font-sans)",
                    color: TEXT,
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>Heure de fin</label>
                <input
                  type="time"
                  value={prefs.quietHoursEnd}
                  onChange={(e) => setPrefs({ ...prefs, quietHoursEnd: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    fontSize: 13,
                    fontFamily: "var(--font-sans)",
                    color: TEXT,
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Digest Frequency */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Mail size={18} style={{ color: ACCENT }} />
            <h2 style={sectionTitleStyle}>Fréquence du récapitulatif (Simulé)</h2>
          </div>
        </div>
        <div style={sectionBodyStyle}>
          <div style={{ maxWidth: 400 }}>
            <label style={labelStyle}>Récapitulatif périodique</label>
            <select
              value={prefs.digestFrequency}
              onChange={(e) => setPrefs({ ...prefs, digestFrequency: e.target.value as DigestFrequency })}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 13,
                fontFamily: "var(--font-sans)",
                color: TEXT,
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
              }}
            >
              {DIGEST_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit Action Bar */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            border: "none",
            borderRadius: "var(--radius-md)",
            background: ACCENT,
            color: "#fff",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          <Save size={14} />
          <span>Enregistrer les préférences</span>
        </button>
      </div>

      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="admin-settings-toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
