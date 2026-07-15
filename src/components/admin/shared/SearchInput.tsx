import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { BORDER, TEXT, ACCENT } from "../../../constants";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
  debounceMs = 300,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Sync external value changes
  useEffect(() => { setLocalValue(value); }, [value]);

  const handleChange = (val: string) => {
    setLocalValue(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(val), debounceMs);
  };

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <Search
        size={15}
        style={{ position: "absolute", left: 12, color: "var(--muted)", pointerEvents: "none" }}
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{
          width: "100%",
          minWidth: 200,
          padding: "8px 36px 8px 36px",
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-md)",
          background: "var(--background)",
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
      {localValue && (
        <button
          type="button"
          onClick={() => handleChange("")}
          aria-label="Effacer la recherche"
          style={{
            position: "absolute",
            right: 8,
            background: "none",
            border: "none",
            color: "var(--muted)",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
