import { useState, useEffect, useRef, useMemo } from "react";
import { Save, RotateCcw, Globe, Sun, Moon, Monitor, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "../../../services/adminService";
import type { AdminProfile, InterfaceLanguage, InterfaceTheme, InterfaceDensity, DateFormatOption, TimeFormatOption } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

const LANG_OPTIONS: { value: InterfaceLanguage; label: string; dir: string }[] = [
  { value: "fr", label: "Français", dir: "ltr" },
  { value: "en", label: "English", dir: "ltr" },
  { value: "ar", label: "العربية", dir: "rtl" },
];

const THEME_OPTIONS: { value: InterfaceTheme; label: string; icon: typeof Sun }[] = [
  { value: "system", label: "Système", icon: Monitor },
  { value: "light", label: "Clair", icon: Sun },
  { value: "dark", label: "Sombre", icon: Moon },
];

const DENSITY_OPTIONS: { value: InterfaceDensity; label: string; icon: typeof Maximize2 }[] = [
  { value: "comfortable", label: "Confortable", icon: Maximize2 },
  { value: "compact", label: "Compact", icon: Minimize2 },
];

const DATE_FORMATS: DateFormatOption[] = ["DD/MM/YYYY", "YYYY-MM-DD", "DD MMM YYYY"];
const TIME_FORMATS: { value: TimeFormatOption; label: string }[] = [
  { value: "24h", label: "24 heures (14:30)" },
  { value: "12h", label: "12 heures (2:30 PM)" },
];

const sectionStyle: React.CSSProperties = { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-lg)", overflow: "hidden" };
const sectionHeaderStyle: React.CSSProperties = { padding: "18px 24px", borderBottom: `1px solid ${BORDER}` };
const sectionTitleStyle: React.CSSProperties = { margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT };
const sectionBodyStyle: React.CSSProperties = { padding: 24 };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginBottom: 10 };
const helperStyle: React.CSSProperties = { fontSize: 12, color: TEXT_SECONDARY, marginTop: 6, fontFamily: "var(--font-sans)" };
const selectStyle: React.CSSProperties = {
  padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-sans)", color: TEXT,
  background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", cursor: "pointer", appearance: "auto" as const,
};
const btnBase: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px",
  borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

interface ProfilePreferencesFormProps {
  profile: AdminProfile;
  onUpdated: (p: AdminProfile) => void;
}

export default function ProfilePreferencesForm({ profile, onUpdated }: ProfilePreferencesFormProps) {
  const [language, setLanguage] = useState<InterfaceLanguage>(profile.language);
  const [theme, setTheme] = useState<InterfaceTheme>(profile.theme);
  const [density, setDensity] = useState<InterfaceDensity>(profile.interfaceDensity);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [dateFormat, setDateFormat] = useState<DateFormatOption>(profile.dateFormat);
  const [timeFormat, setTimeFormat] = useState<TimeFormatOption>(profile.timeFormat);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const initialRef = useRef("");
  useEffect(() => {
    initialRef.current = JSON.stringify({ language: profile.language, theme: profile.theme, density: profile.interfaceDensity, timezone: profile.timezone, dateFormat: profile.dateFormat, timeFormat: profile.timeFormat });
  }, [profile]);
  const snapshot = useMemo(() => JSON.stringify({ language, theme, density, timezone, dateFormat, timeFormat }), [language, theme, density, timezone, dateFormat, timeFormat]);
  const isDirty = initialRef.current !== "" && snapshot !== initialRef.current;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminService.updateAdminProfilePreferences(profile.userId, {
        language, theme, interfaceDensity: density, timezone, dateFormat, timeFormat,
      });
      onUpdated(updated);
      setToast("Préférences enregistrées.");
      setTimeout(() => setToast(null), 3000);
    } catch { /* */ }
    setSaving(false);
  };

  const handleReset = () => {
    setLanguage(profile.language);
    setTheme(profile.theme);
    setDensity(profile.interfaceDensity);
    setTimezone(profile.timezone);
    setDateFormat(profile.dateFormat);
    setTimeFormat(profile.timeFormat);
  };

  // Live preview sample
  const now = new Date();
  const previewDate = dateFormat === "YYYY-MM-DD"
    ? now.toISOString().slice(0, 10)
    : dateFormat === "DD MMM YYYY"
      ? now.toLocaleDateString(language === "ar" ? "ar-MA" : language === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "short", year: "numeric" })
      : now.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const previewTime = timeFormat === "12h"
    ? now.toLocaleTimeString(language === "en" ? "en-US" : "fr-FR", { hour: "numeric", minute: "2-digit", hour12: true })
    : now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false });

  const previewLang = LANG_OPTIONS.find((l) => l.value === language);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Language */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Langue de l'interface</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {LANG_OPTIONS.map((opt) => (
              <button key={opt.value}
                className={`admin-profile-pref-option${language === opt.value ? " selected" : ""}`}
                onClick={() => setLanguage(opt.value)}
                dir={opt.dir}
                aria-pressed={language === opt.value}
              >
                <Globe size={16} style={{ color: language === opt.value ? ACCENT : TEXT_SECONDARY }} />
                <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-sans)", color: TEXT }}>{opt.label}</span>
              </button>
            ))}
          </div>
          <div style={helperStyle}>Les préférences de langue sont temporaires et ne modifient pas les traductions publiques.</div>
        </div>
      </div>

      {/* Theme */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Thème</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button key={opt.value}
                  className={`admin-profile-pref-option${theme === opt.value ? " selected" : ""}`}
                  onClick={() => setTheme(opt.value)}
                  aria-pressed={theme === opt.value}
                >
                  <Icon size={16} style={{ color: theme === opt.value ? ACCENT : TEXT_SECONDARY }} />
                  <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-sans)", color: TEXT }}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Density */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Densité de l'interface</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {DENSITY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button key={opt.value}
                  className={`admin-profile-pref-option${density === opt.value ? " selected" : ""}`}
                  onClick={() => setDensity(opt.value)}
                  aria-pressed={density === opt.value}
                >
                  <Icon size={16} style={{ color: density === opt.value ? ACCENT : TEXT_SECONDARY }} />
                  <span style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-sans)", color: TEXT }}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Date et heure</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-form-grid">
            <div>
              <label style={labelStyle}>Fuseau horaire</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ ...selectStyle, width: "100%" }}>
                <option value="Africa/Casablanca">Africa/Casablanca (GMT+1)</option>
                <option value="Europe/Paris">Europe/Paris (CET)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Format de date</label>
              <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value as DateFormatOption)} style={{ ...selectStyle, width: "100%" }}>
                {DATE_FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Format d'heure</label>
              <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value as TimeFormatOption)} style={{ ...selectStyle, width: "100%" }}>
                {TIME_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Aperçu en direct</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--background)", border: `1px solid ${BORDER}` }}
            dir={previewLang?.dir || "ltr"}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginBottom: 8 }}>
              {language === "ar" ? "معاينة التفضيلات" : language === "en" ? "Preferences Preview" : "Aperçu des préférences"}
            </div>
            <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", lineHeight: 1.8 }}>
              <div>{language === "ar" ? "اللغة" : language === "en" ? "Language" : "Langue"} : <strong>{previewLang?.label}</strong></div>
              <div>{language === "ar" ? "التاريخ" : language === "en" ? "Date" : "Date"} : <strong>{previewDate}</strong></div>
              <div>{language === "ar" ? "الوقت" : language === "en" ? "Time" : "Heure"} : <strong>{previewTime}</strong></div>
              <div>{language === "ar" ? "المنطقة الزمنية" : language === "en" ? "Timezone" : "Fuseau"} : <strong>{timezone}</strong></div>
            </div>
          </div>
          <div style={helperStyle}>Ces préférences sont temporaires et seront réinitialisées après actualisation.</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}>
        {isDirty && (
          <button onClick={handleReset} style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT_SECONDARY }}>
            <RotateCcw size={14} /> Réinitialiser
          </button>
        )}
        <button onClick={handleSave} disabled={saving || !isDirty}
          style={{ ...btnBase, border: "none", background: ACCENT, color: "#fff", opacity: saving || !isDirty ? 0.5 : 1 }}
        >
          <Save size={14} /> Enregistrer les préférences
        </button>
      </div>

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
