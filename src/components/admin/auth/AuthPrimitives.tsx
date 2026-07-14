import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

// ── Auth Page Layout ──
// Full-page centered wrapper with background decoration and card container.

interface AuthPageLayoutProps {
  children: ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--background)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, rgba(249,115,22,0.06) 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.05) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}
      >
        {/* Card */}
        <div
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-xl)",
            padding: "40px 32px",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// ── Auth Logo ──
// The branded IT logo block used on all auth pages.

interface AuthLogoProps {
  title: string;
  subtitle: string;
}

export function AuthLogo({ title, subtitle }: AuthLogoProps) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "var(--radius-md)",
          background: `linear-gradient(135deg, var(--primary), ${ACCENT})`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "var(--font-display)",
          marginBottom: 16,
        }}
      >
        IT
      </div>
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          color: TEXT,
          margin: 0,
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 6, margin: "6px 0 0" }}>
        {subtitle}
      </p>
    </div>
  );
}

// ── Auth Error Message ──
// Animated error alert banner.

interface AuthErrorProps {
  message: string;
}

export function AuthError({ message }: AuthErrorProps) {
  if (!message) return null;

  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        marginBottom: 20,
        borderRadius: "var(--radius-md)",
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.2)",
        color: "var(--danger)",
        fontSize: 13,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </motion.div>
  );
}

// ── Auth Spinner ──
// Loading spinner used in submit buttons.

export function AuthSpinner() {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "admin-spin 0.8s linear infinite",
      }}
    />
  );
}

// ── Auth Input ──
// Form input with icon, label, and focus ring.

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  icon: ReactNode;
  rightElement?: ReactNode;
}

export function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  autoFocus,
  disabled,
  icon,
  rightElement,
}: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{ display: "block", fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}
      >
        {label}
      </label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            left: 14,
            color: "var(--muted)",
            pointerEvents: "none",
            display: "flex",
          }}
        >
          {icon}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          disabled={disabled}
          style={{
            width: "100%",
            padding: `12px 16px 12px 44px`,
            paddingRight: rightElement ? 44 : 16,
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: "var(--background)",
            color: TEXT,
            fontSize: 14,
            fontFamily: "var(--font-sans)",
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.boxShadow = `0 0 0 3px rgba(249,115,22,0.1)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = BORDER;
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {rightElement && (
          <div style={{ position: "absolute", right: 12, display: "flex" }}>
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Auth Submit Button ──
// Primary form button with loading state.

interface AuthSubmitProps {
  label: string;
  icon: ReactNode;
  isSubmitting: boolean;
}

export function AuthSubmit({ label, icon, isSubmitting }: AuthSubmitProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      style={{
        width: "100%",
        padding: "12px 24px",
        border: "none",
        borderRadius: "var(--radius-md)",
        background: isSubmitting ? "var(--muted)" : ACCENT,
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "var(--font-sans)",
        cursor: isSubmitting ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "background 0.2s, transform 0.1s",
      }}
    >
      {isSubmitting ? <AuthSpinner /> : <>{icon}{label}</>}
    </button>
  );
}
