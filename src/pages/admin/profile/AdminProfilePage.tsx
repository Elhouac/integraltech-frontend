import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { User, Settings2, Shield, Monitor, Info } from "lucide-react";
import ProfilePersonalForm from "../../../components/admin/profile/ProfilePersonalForm";
import ProfilePreferencesForm from "../../../components/admin/profile/ProfilePreferencesForm";
import ProfileSecurityForm from "../../../components/admin/profile/ProfileSecurityForm";
import ProfileSessionsPanel from "../../../components/admin/profile/ProfileSessionsPanel";
import { adminService } from "../../../services/adminService";
import { useAuth } from "../../../context/AuthContext";
import type { AdminProfile } from "../../../types/admin";
import { ACCENT, TEXT, TEXT_SECONDARY } from "../../../constants";

type TabKey = "profile" | "preferences" | "security" | "sessions";

const TABS: { key: TabKey; label: string; icon: typeof User }[] = [
  { key: "profile", label: "Profil", icon: User },
  { key: "preferences", label: "Préférences", icon: Settings2 },
  { key: "security", label: "Sécurité", icon: Shield },
  { key: "sessions", label: "Sessions", icon: Monitor },
];

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(false);
    try {
      const p = await adminService.getCurrentAdminProfile(user.id);
      setProfile(p ?? null);
      setAvatarFailed(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleProfileUpdated = (p: AdminProfile) => {
    setProfile(p);
    setAvatarFailed(false);
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = TABS.length - 1;
    else return;
    event.preventDefault();
    setActiveTab(TABS[nextIndex].key);
    tabRefs.current[nextIndex]?.focus();
  };

  if (loading) {
    return (
      <div role="status" aria-live="polite" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <div style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Chargement du profil…</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="admin-alert admin-alert-error" role="alert">
        <span>Impossible de charger le profil de démonstration.</span>
        <button type="button" onClick={() => void fetchProfile()}>Réessayer</button>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `${ACCENT}15`, fontSize: 28, color: ACCENT }}>?</div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>Profil introuvable</h2>
        <p style={{ margin: 0, fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", maxWidth: 400 }}>
          Aucun profil de démonstration n'est associé à votre compte. Rechargez la page ou reconnectez-vous.
        </p>
      </div>
    );
  }

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase() || user.name.charAt(0).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
      >
        <div className="admin-profile-avatar-circle" style={{ width: 56, height: 56, fontSize: 22 }}>
          {profile.avatarUrl && !avatarFailed ? (
            <img src={profile.avatarUrl} alt={`Photo de ${profile.displayName}`}
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}>
            {profile.displayName}
          </h1>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", margin: "2px 0 0" }}>
            {profile.jobTitle || profile.role} · {profile.loginEmail}
          </p>
        </div>
      </motion.div>

      {/* Demo notice */}
      <div className="admin-settings-demo-notice" role="status">
        <Info size={16} style={{ flexShrink: 0, marginTop: 1, color: ACCENT }} />
        <span>Mode démonstration : toutes les modifications sont temporaires et seront réinitialisées après actualisation.</span>
      </div>

      {/* Tabs */}
      <div className="admin-profile-tabs" role="tablist" aria-label="Sections du profil">
        {TABS.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              ref={(element) => { tabRefs.current[index] = element; }}
              type="button"
              className={`admin-profile-tab${activeTab === tab.key ? " active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
              id={`tab-${tab.key}`}
              tabIndex={activeTab === tab.key ? 0 : -1}
            >
              <Icon size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {activeTab === "profile" && (
          <ProfilePersonalForm profile={profile} onUpdated={handleProfileUpdated} />
        )}
        {activeTab === "preferences" && (
          <ProfilePreferencesForm profile={profile} onUpdated={handleProfileUpdated} />
        )}
        {activeTab === "security" && (
          <ProfileSecurityForm profile={profile} userId={user.id} />
        )}
        {activeTab === "sessions" && (
          <ProfileSessionsPanel userId={user.id} />
        )}
      </div>
    </div>
  );
}
