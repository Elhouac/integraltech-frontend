import { useState, useEffect, useCallback } from "react";
import { Monitor, Smartphone, Tablet, Globe, Wifi, Clock, MapPin, ShieldCheck, ShieldX, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog from "../shared/ConfirmDialog";
import { adminService } from "../../../services/adminService";
import type { MockAccountSession } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

const btnBase: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px",
  borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, cursor: "pointer",
};

function getDeviceIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes("iphone") || l.includes("android") || l.includes("mobile")) return Smartphone;
  if (l.includes("tablette") || l.includes("ipad") || l.includes("tablet")) return Tablet;
  return Monitor;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

interface ProfileSessionsPanelProps {
  userId: number;
}

export default function ProfileSessionsPanel({ userId }: ProfileSessionsPanelProps) {
  const [sessions, setSessions] = useState<MockAccountSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [revokeDialog, setRevokeDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [revokeAllDialog, setRevokeAllDialog] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await adminService.getMockAccountSessions(userId);
      setSessions(data);
    } catch { /* */ }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleRevoke = async () => {
    if (revokeDialog.id === null) return;
    try {
      await adminService.revokeMockAccountSession(userId, revokeDialog.id);
      await fetchSessions();
      showToast("Session révoquée.");
    } catch { /* */ }
    setRevokeDialog({ open: false, id: null });
  };

  const handleRevokeAll = async () => {
    try {
      await adminService.revokeAllOtherMockAccountSessions(userId);
      await fetchSessions();
      showToast("Toutes les autres sessions ont été révoquées.");
    } catch { /* */ }
    setRevokeAllDialog(false);
  };

  const activeOtherCount = sessions.filter((s) => !s.isCurrent && s.status === "active").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Warning */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 16px", borderRadius: "var(--radius-md)", background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 2, color: ACCENT }} />
        <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          Sessions de démonstration : aucune session serveur réelle n'est consultée ou révoquée.
        </span>
      </div>

      {/* Header with bulk action */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>
            Sessions actives
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            {sessions.length} session(s) · {activeOtherCount} autre(s) active(s)
          </p>
        </div>
        {activeOtherCount > 0 && (
          <button onClick={() => setRevokeAllDialog(true)}
            style={{ ...btnBase, border: "none", background: DANGER, color: "#fff" }}
          >
            <AlertTriangle size={13} /> Révoquer toutes les autres
          </button>
        )}
      </div>

      {/* Sessions list */}
      {loading ? (
        <div style={{ padding: 32, textAlign: "center", fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Chargement…</div>
      ) : sessions.length === 0 ? (
        <div style={{ padding: 32, textAlign: "center", fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Aucune session trouvée.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sessions.map((s) => {
            const DevIcon = getDeviceIcon(s.deviceLabel);
            const isRevoked = s.status === "revoked";
            return (
              <div key={s.id} className={`admin-profile-session-card${s.isCurrent ? " current" : ""}`}
                style={isRevoked ? { opacity: 0.55 } : {}}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center",
                  background: s.isCurrent ? `${ACCENT}15` : "var(--background)", flexShrink: 0,
                }}>
                  <DevIcon size={20} style={{ color: s.isCurrent ? ACCENT : TEXT_SECONDARY }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>{s.deviceLabel}</span>
                    {s.isCurrent && (
                      <span style={{ padding: "2px 8px", borderRadius: "var(--radius-sm)", background: `${ACCENT}15`, color: ACCENT, fontSize: 11, fontWeight: 700, fontFamily: "var(--font-sans)" }}>
                        Session actuelle
                      </span>
                    )}
                    {isRevoked && (
                      <span style={{ padding: "2px 8px", borderRadius: "var(--radius-sm)", background: "rgba(239,68,68,0.1)", color: DANGER, fontSize: 11, fontWeight: 700, fontFamily: "var(--font-sans)" }}>
                        Révoquée
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Globe size={12} /> {s.browserLabel} · {s.platformLabel}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={12} /> {s.approximateLocationLabel}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Wifi size={12} /> {s.ipLabel}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} /> Dernière activité : {formatDate(s.lastActiveAt)}
                    </span>
                  </div>
                </div>

                <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                  {s.isCurrent ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#22C55E", fontWeight: 600, fontFamily: "var(--font-sans)" }}>
                      <ShieldCheck size={14} /> Actif
                    </span>
                  ) : isRevoked ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                      <ShieldX size={14} /> Révoquée
                    </span>
                  ) : (
                    <button onClick={() => setRevokeDialog({ open: true, id: s.id })}
                      style={{ ...btnBase, border: `1px solid ${DANGER}`, background: "transparent", color: DANGER }}
                    >
                      Révoquer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={revokeDialog.open}
        title="Révoquer cette session"
        message="Êtes-vous sûr de vouloir révoquer cette session de démonstration ?"
        confirmLabel="Révoquer"
        onConfirm={handleRevoke}
        onCancel={() => setRevokeDialog({ open: false, id: null })}
      />
      <ConfirmDialog
        open={revokeAllDialog}
        title="Révoquer toutes les autres sessions"
        message={`Êtes-vous sûr de vouloir révoquer ${activeOtherCount} session(s) de démonstration ?`}
        confirmLabel="Révoquer tout"
        onConfirm={handleRevokeAll}
        onCancel={() => setRevokeAllDialog(false)}
      />

      <AnimatePresence>
        {toast && (
          <motion.div className="admin-settings-toast"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
