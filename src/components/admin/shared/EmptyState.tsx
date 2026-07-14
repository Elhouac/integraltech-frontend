import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { ACCENT, TEXT, TEXT_SECONDARY } from "../../../constants";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

function EmptyStateComponent({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "var(--radius-lg)",
          background: "rgba(249,115,22,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Icon size={24} color="var(--muted)" strokeWidth={1.5} />
      </div>
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: TEXT,
          fontFamily: "var(--font-display)",
          margin: "0 0 6px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 13,
          color: TEXT_SECONDARY,
          fontFamily: "var(--font-sans)",
          maxWidth: 320,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: 20,
            padding: "8px 20px",
            border: "none",
            borderRadius: "var(--radius-md)",
            background: ACCENT,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

const EmptyState = memo(EmptyStateComponent);
export default EmptyState;
