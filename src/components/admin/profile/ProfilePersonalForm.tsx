import { useState, useMemo, useEffect, useRef } from "react";
import { Save, RotateCcw, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileAvatarEditor from "./ProfileAvatarEditor";
import { adminService } from "../../../services/adminService";
import type { AdminProfile } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

const BIO_MAX = 500;

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-sans)", color: TEXT,
  background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", outline: "none",
};
const readOnlyStyle: React.CSSProperties = { ...inputStyle, background: "var(--background)", cursor: "not-allowed", opacity: 0.7 };
const errStyle: React.CSSProperties = { fontSize: 12, color: DANGER, marginTop: 4, fontFamily: "var(--font-sans)" };
const helperStyle: React.CSSProperties = { fontSize: 12, color: TEXT_SECONDARY, marginTop: 4, fontFamily: "var(--font-sans)" };
const sectionStyle: React.CSSProperties = { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-lg)", overflow: "hidden" };
const sectionHeaderStyle: React.CSSProperties = { padding: "18px 24px", borderBottom: `1px solid ${BORDER}` };
const sectionTitleStyle: React.CSSProperties = { margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT };
const sectionBodyStyle: React.CSSProperties = { padding: 24 };
const btnBase: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px",
  borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function isValidPhone(p: string): boolean {
  if (!p.trim()) return true; // optional
  return /^[+]?[\d\s\-()]{7,20}$/.test(p.trim());
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrateur",
  editor: "Éditeur",
  support: "Support",
  viewer: "Observateur",
  reader: "Lecteur",
};

interface ProfilePersonalFormProps {
  profile: AdminProfile;
  onUpdated: (p: AdminProfile) => void;
}

export default function ProfilePersonalForm({ profile, onUpdated }: ProfilePersonalFormProps) {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [contactEmail, setContactEmail] = useState(profile.contactEmail);
  const [phone, setPhone] = useState(profile.phone);
  const [jobTitle, setJobTitle] = useState(profile.jobTitle);
  const [department, setDepartment] = useState(profile.department);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dirty tracking
  const initialRef = useRef("");
  useEffect(() => {
    initialRef.current = JSON.stringify({ firstName: profile.firstName, lastName: profile.lastName, displayName: profile.displayName, contactEmail: profile.contactEmail, phone: profile.phone, jobTitle: profile.jobTitle, department: profile.department, bio: profile.bio, avatarUrl: profile.avatarUrl });
  }, [profile]);

  const snapshot = useMemo(() => JSON.stringify({ firstName, lastName, displayName, contactEmail, phone, jobTitle, department, bio, avatarUrl }), [firstName, lastName, displayName, contactEmail, phone, jobTitle, department, bio, avatarUrl]);
  const isDirty = initialRef.current !== "" && snapshot !== initialRef.current;

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [isDirty]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Prénom requis.";
    if (!lastName.trim()) e.lastName = "Nom requis.";
    if (!displayName.trim()) e.displayName = "Nom d'affichage requis.";
    if (contactEmail.trim() && !isValidEmail(contactEmail.trim())) e.contactEmail = "Email de contact invalide.";
    if (!isValidPhone(phone)) e.phone = "Format de téléphone invalide.";
    if (bio.length > BIO_MAX) e.bio = `Maximum ${BIO_MAX} caractères.`;
    if (firstName.trim().length > 100) e.firstName = "Trop long (max 100).";
    if (lastName.trim().length > 100) e.lastName = "Trop long (max 100).";
    if (displayName.trim().length > 100) e.displayName = "Trop long (max 100).";
    if (avatarUrl) {
      try {
        const parsed = new URL(avatarUrl);
        if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || parsed.username || parsed.password) {
          e.avatarUrl = "URL de photo invalide ou contenant des identifiants.";
        }
      } catch {
        e.avatarUrl = "URL de photo invalide.";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      let updated = await adminService.updateCurrentAdminProfile(profile.userId, {
        firstName: firstName.trim(), lastName: lastName.trim(), displayName: displayName.trim(),
        contactEmail: contactEmail.trim(), phone: phone.trim(), jobTitle: jobTitle.trim(),
        department: department.trim(), bio: bio.trim(),
      });
      if (avatarUrl !== profile.avatarUrl) {
        updated = avatarUrl
          ? await adminService.updateAdminProfileAvatar(profile.userId, avatarUrl)
          : await adminService.removeAdminProfileAvatar(profile.userId);
      }
      onUpdated(updated);
      setToast("Informations personnelles enregistrées.");
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("Impossible d'enregistrer toutes les modifications de démonstration.");
      setTimeout(() => setToast(null), 3000);
    }
    setSaving(false);
  };

  const handleReset = () => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setDisplayName(profile.displayName);
    setContactEmail(profile.contactEmail);
    setPhone(profile.phone);
    setJobTitle(profile.jobTitle);
    setDepartment(profile.department);
    setBio(profile.bio);
    setAvatarUrl(profile.avatarUrl);
    setErrors({});
  };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Avatar */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Photo de profil</h2></div>
        <ProfileAvatarEditor
          avatarUrl={avatarUrl}
          initials={initials}
          onAvatarChange={(url) => setAvatarUrl(url)}
          onAvatarRemove={() => setAvatarUrl("")}
        />
        {errors.avatarUrl && <div style={{ ...errStyle, padding: "0 20px 16px" }}>{errors.avatarUrl}</div>}
      </div>

      {/* Personal fields */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Informations personnelles</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-form-grid">
            <div>
              <label style={labelStyle} htmlFor="pf-first">Prénom <span style={{ color: ACCENT }}>*</span></label>
              <input id="pf-first" type="text" value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: "" })); }}
                style={{ ...inputStyle, ...(errors.firstName ? { borderColor: DANGER } : {}) }}
              />
              {errors.firstName && <div style={errStyle}>{errors.firstName}</div>}
            </div>
            <div>
              <label style={labelStyle} htmlFor="pf-last">Nom <span style={{ color: ACCENT }}>*</span></label>
              <input id="pf-last" type="text" value={lastName}
                onChange={(e) => { setLastName(e.target.value); setErrors((p) => ({ ...p, lastName: "" })); }}
                style={{ ...inputStyle, ...(errors.lastName ? { borderColor: DANGER } : {}) }}
              />
              {errors.lastName && <div style={errStyle}>{errors.lastName}</div>}
            </div>
            <div>
              <label style={labelStyle} htmlFor="pf-display">Nom d'affichage <span style={{ color: ACCENT }}>*</span></label>
              <input id="pf-display" type="text" value={displayName}
                onChange={(e) => { setDisplayName(e.target.value); setErrors((p) => ({ ...p, displayName: "" })); }}
                style={{ ...inputStyle, ...(errors.displayName ? { borderColor: DANGER } : {}) }}
              />
              {errors.displayName && <div style={errStyle}>{errors.displayName}</div>}
            </div>
            <div>
              <label style={labelStyle} htmlFor="pf-job">Poste</label>
              <input id="pf-job" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="pf-dept">Département</label>
              <input id="pf-dept" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="pf-phone">Téléphone</label>
              <input id="pf-phone" type="tel" value={phone}
                onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
                placeholder="+212..."
                style={{ ...inputStyle, ...(errors.phone ? { borderColor: DANGER } : {}) }}
              />
              {errors.phone && <div style={errStyle}>{errors.phone}</div>}
            </div>
          </div>

          {/* Contact email */}
          <div style={{ marginTop: 20 }}>
            <label style={labelStyle} htmlFor="pf-contact-email">Email de contact</label>
            <input id="pf-contact-email" type="email" value={contactEmail}
              onChange={(e) => { setContactEmail(e.target.value); setErrors((p) => ({ ...p, contactEmail: "" })); }}
              style={{ ...inputStyle, ...(errors.contactEmail ? { borderColor: DANGER } : {}) }}
            />
            {errors.contactEmail && <div style={errStyle}>{errors.contactEmail}</div>}
          </div>

          {/* Bio */}
          <div style={{ marginTop: 20 }}>
            <label style={labelStyle} htmlFor="pf-bio">Bio</label>
            <textarea id="pf-bio" value={bio}
              onChange={(e) => { if (e.target.value.length <= BIO_MAX + 50) setBio(e.target.value); }}
              rows={3}
              style={{ ...inputStyle, resize: "vertical", minHeight: 80, ...(errors.bio ? { borderColor: DANGER } : {}) }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
              {errors.bio ? <span style={errStyle}>{errors.bio}</span> : <span />}
              <span style={{ fontSize: 12, color: bio.length > BIO_MAX ? DANGER : TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                {bio.length} / {BIO_MAX}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Read-only fields */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Informations du compte</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-form-grid">
            <div>
              <label style={labelStyle}>ID utilisateur</label>
              <input type="text" value={String(profile.userId)} readOnly style={readOnlyStyle} />
            </div>
            <div>
              <label style={labelStyle}>Rôle</label>
              <input type="text" value={ROLE_LABELS[profile.role] || profile.role} readOnly style={readOnlyStyle} />
            </div>
            <div className="full-width">
              <label style={labelStyle}>Adresse de connexion</label>
              <input type="email" value={profile.loginEmail} readOnly style={readOnlyStyle} />
              <div style={helperStyle}>
                L'adresse de connexion est gérée par le système d'authentification et ne peut pas être modifiée dans cette démonstration.
              </div>
            </div>
            {profile.createdAt && (
              <div>
                <label style={labelStyle}>Compte créé le</label>
                <input type="text" value={new Date(profile.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} readOnly style={readOnlyStyle} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}>
        {isDirty && (
          <button onClick={handleReset} style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT_SECONDARY }}>
            <RotateCcw size={14} /> Annuler les modifications
          </button>
        )}
        <button onClick={handleSave} disabled={saving || !isDirty}
          style={{ ...btnBase, border: "none", background: ACCENT, color: "#fff", opacity: saving || !isDirty ? 0.5 : 1 }}
        >
          <Save size={14} /> Enregistrer
        </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="admin-settings-toast" role="status" aria-live="polite"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
