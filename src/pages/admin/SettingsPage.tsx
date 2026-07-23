import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Phone, Share2, Mail, Bell, Info, Check } from "lucide-react";
import GeneralSettings from "../../components/admin/settings/GeneralSettings";
import ContactSettings from "../../components/admin/settings/ContactSettings";
import SocialSettings from "../../components/admin/settings/SocialSettings";
import EmailSmtpSettings from "../../components/admin/settings/EmailSmtpSettings";
import NotificationSettings from "../../components/admin/settings/NotificationSettings";
import { TEXT, TEXT_SECONDARY, ACCENT, BORDER, SURFACE } from "../../constants";

/* ── Tab definitions ── */
const TABS = [
  { id: "general", label: "Général", icon: Settings },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "social", label: "Réseaux sociaux", icon: Share2 },
  { id: "email", label: "Email & SMTP", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

type TabId = (typeof TABS)[number]["id"];

export interface SettingsTabProps {
  onDirtyChange: (dirty: boolean) => void;
  onSaveSuccess: (message?: string) => void;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [isDirty, setIsDirty] = useState(false);
  const [pendingTab, setPendingTab] = useState<TabId | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogReturnTabRef = useRef<TabId>("general");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Toast ── */
  const showToast = useCallback((message = "Paramètres enregistrés avec succès.") => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  /* ── Tab switching with dirty guard ── */
  const handleTabChange = useCallback(
    (tab: TabId) => {
      if (tab === activeTab) return;
      if (isDirty) {
        dialogReturnTabRef.current = activeTab;
        setPendingTab(tab);
      } else {
        setActiveTab(tab);
      }
    },
    [isDirty, activeTab],
  );

  const confirmLeave = useCallback(() => {
    if (pendingTab) {
      dialogReturnTabRef.current = pendingTab;
      setActiveTab(pendingTab);
      setPendingTab(null);
      setIsDirty(false);
    }
  }, [pendingTab]);

  const cancelLeave = useCallback(() => {
    dialogReturnTabRef.current = activeTab;
    setPendingTab(null);
  }, [activeTab]);

  useEffect(() => {
    if (!pendingTab) return;
    cancelButtonRef.current?.focus();
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelLeave();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown);
      const returnIndex = TABS.findIndex((tab) => tab.id === dialogReturnTabRef.current);
      tabRefs.current[returnIndex]?.focus();
    };
  }, [cancelLeave, pendingTab]);

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = TABS.length - 1;
    else return;
    event.preventDefault();
    handleTabChange(TABS[nextIndex].id);
    if (!isDirty) tabRefs.current[nextIndex]?.focus();
  };

  /* ── Tab renderer ── */
  const tabProps: SettingsTabProps = { onDirtyChange: setIsDirty, onSaveSuccess: showToast };

  function renderTab() {
    switch (activeTab) {
      case "general":
        return <GeneralSettings {...tabProps} />;
      case "contact":
        return <ContactSettings {...tabProps} />;
      case "social":
        return <SocialSettings {...tabProps} />;
      case "email":
        return <EmailSmtpSettings {...tabProps} />;
      case "notifications":
        return <NotificationSettings {...tabProps} />;
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Page header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            color: TEXT,
            margin: 0,
          }}
        >
          Paramètres
        </h1>
        <p
          style={{
            fontSize: 14,
            color: TEXT_SECONDARY,
            fontFamily: "var(--font-sans)",
            margin: "4px 0 0",
          }}
        >
          Configurez votre plateforme IntegralTech.
        </p>
      </motion.div>

      {/* ── Demo notice ── */}
      <div className="admin-settings-demo-notice" role="status">
        <Info size={16} style={{ flexShrink: 0, marginTop: 1, color: ACCENT }} />
        <span>Mode démonstration : aucune donnée n'est enregistrée dans une base et les changements sont réinitialisés au rechargement. L'intégration backend reste requise.</span>
      </div>

      {/* ── Tab bar ── */}
      <div className="admin-settings-tabs" role="tablist" aria-label="Paramètres">
        {TABS.map((tab, index) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`settings-tab-${tab.id}`}
              ref={(element) => { tabRefs.current[index] = element; }}
              type="button"
              aria-selected={active}
              aria-controls={`settings-panel-${tab.id}`}
              aria-label={tab.label}
              tabIndex={active ? 0 : -1}
              data-active={active}
              className="admin-settings-tab"
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <tab.icon size={16} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Active panel ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          id={`settings-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`settings-tab-${activeTab}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>

      {/* ── Unsaved changes dialog ── */}
      <AnimatePresence>
        {pendingTab && (
          <motion.div
            className="admin-settings-unsaved-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={cancelLeave}
            role="presentation"
          >
            <motion.div
              ref={dialogRef}
              className="admin-settings-unsaved-card"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="settings-unsaved-title"
              aria-describedby="settings-unsaved-description"
            >
              <h3 id="settings-unsaved-title">Modifications non enregistrées</h3>
              <p id="settings-unsaved-description">Voulez-vous quitter cet onglet sans enregistrer vos modifications ?</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button
                  ref={cancelButtonRef}
                  type="button"
                  onClick={cancelLeave}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${BORDER}`,
                    background: SURFACE,
                    color: TEXT,
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Rester
                </button>
                <button
                  type="button"
                  onClick={confirmLeave}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: "var(--danger)",
                    color: "#fff",
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Quitter sans enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="admin-settings-toast"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <Check size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
