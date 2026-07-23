import { useId, useState } from "react";
import { BORDER, SURFACE, TEXT, TEXT_SECONDARY, ACCENT } from "../../../constants";

type LangKey = "fr" | "en" | "ar";

interface MultiLangInputProps {
  value: { fr: string; en: string; ar: string };
  onChange: (val: { fr: string; en: string; ar: string }) => void;
  label: string;
  type?: "input" | "textarea";
  required?: boolean;
}

export default function MultiLangInput({
  value,
  onChange,
  label,
  type = "input",
  required = false,
}: MultiLangInputProps) {
  const [activeTab, setActiveTab] = useState<LangKey>("fr");
  const controlId = useId();

  const handleTextChange = (text: string) => {
    onChange({
      ...value,
      [activeTab]: text,
    });
  };

  const tabs: { key: LangKey; label: string }[] = [
    { key: "fr", label: "FR" },
    { key: "en", label: "EN" },
    { key: "ar", label: "AR" },
  ];
  const languageNames: Record<LangKey, string> = {
    fr: "Français",
    en: "Anglais",
    ar: "Arabe",
  };
  const activeLanguageName = languageNames[activeTab];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      {/* Header with Label and Lang Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <label
          htmlFor={controlId}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: TEXT,
            fontFamily: "var(--font-sans)",
          }}
        >
          {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
        </label>

        {/* Language tabs switcher */}
        <div
          role="group"
          aria-label={`Langue du champ ${label}`}
          style={{
            display: "flex",
            background: "var(--hover)",
            padding: 2,
            borderRadius: "var(--radius-sm)",
            border: `1px solid ${BORDER}`,
          }}
        >
          {tabs.map((tab) => {
            const hasValue = !!value[tab.key]?.trim();
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-pressed={isActive}
                aria-label={`${languageNames[tab.key]}${hasValue ? ", traduction remplie" : ""}`}
                style={{
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  background: isActive ? SURFACE : "transparent",
                  color: isActive ? ACCENT : TEXT_SECONDARY,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {tab.label}
                {hasValue && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#22C55E",
                      display: "inline-block",
                    }}
                    title="Traduction remplie"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input / Textarea display for active language */}
      {type === "textarea" ? (
        <textarea
          id={controlId}
          value={value[activeTab] || ""}
          onChange={(e) => handleTextChange(e.target.value)}
          dir={activeTab === "ar" ? "rtl" : "ltr"}
          aria-label={`${label} (${activeLanguageName})`}
          style={{
            width: "100%",
            minHeight: 110,
            padding: "10px 14px",
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: SURFACE,
            color: TEXT,
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            outline: "none",
            resize: "vertical",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = BORDER;
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      ) : (
        <input
          id={controlId}
          type="text"
          value={value[activeTab] || ""}
          onChange={(e) => handleTextChange(e.target.value)}
          dir={activeTab === "ar" ? "rtl" : "ltr"}
          aria-label={`${label} (${activeLanguageName})`}
          style={{
            width: "100%",
            padding: "8px 14px",
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: SURFACE,
            color: TEXT,
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = BORDER;
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      )}
    </div>
  );
}
